// src/components/AdminImageUploader.jsx
import { useState, useEffect } from "react";
import { storage, db, auth } from "../firebase/config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Upload, CheckCircle, AlertCircle, Loader2, Copy, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminImageUploader() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check authentication status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setCheckingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const handleFile = (e) => {
    const selectedFile = e.target.files[0] ?? null;
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setUploadedUrl(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("URL copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy URL");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please choose a file first.");
      toast.error("Please choose a file first.");
      return;
    }

    // Check authentication first
    if (!isAuthenticated) {
      const errorMsg = "You must be logged in to upload images. Please sign in and try again.";
      setError(errorMsg);
      toast.error(errorMsg, { duration: 5000 });
      return;
    }

    let downloadURL = null;
    let filePath = null;

    try {
      setUploading(true);
      setError(null);
      setProgress(0);
      setUploadedUrl(null);
      
      toast.loading("Uploading image to Storage...", { id: "upload" });
      
      // Step 1: Upload to Firebase Storage FIRST
      // put images into folders by type. Example: "banners/filename-<timestamp>"
      filePath = `banners/${Date.now()}-${file.name}`;
      const storageRef = ref(storage, filePath);
      const task = uploadBytesResumable(storageRef, file);

      task.on("state_changed", snap => {
        const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
        setProgress(pct);
      });

      // Wait for upload to complete
      await new Promise((resolve, reject) => {
        task.on("state_changed", 
          null, // on error
          (error) => {
            console.error("Storage upload error:", error);
            // Check for CORS errors specifically
            if (error.code === 'storage/unauthorized' || error.message?.includes('CORS') || error.message?.includes('cors')) {
              reject(new Error("CORS Error: Please check Firebase Storage CORS configuration. Make sure CORS is set up for your origin (localhost:5173)."));
            } else {
              reject(error);
            }
          }, 
          resolve // on complete
        );
      });

      // Step 2: Get download URL ONLY if upload succeeded
      downloadURL = await getDownloadURL(storageRef);
      
      if (!downloadURL) {
        throw new Error("Failed to get download URL after upload");
      }

      console.log("Storage upload successful, URL:", downloadURL);
      
      // Step 3: Save to Firestore ONLY after successful upload
      toast.loading("Saving to database...", { id: "upload" });

      await addDoc(collection(db, "banners"), {
        url: downloadURL,
        path: filePath,
        createdAt: serverTimestamp(),
        alt: file.name,
        active: true
      });

      console.log("Firestore save successful");

      // Success!
      setUploadedUrl(downloadURL);
      setFile(null);
      setPreview(null);
      setProgress(0);
      
      toast.success("Image uploaded and saved successfully!", { 
        id: "upload",
        duration: 5000,
        icon: <CheckCircle className="w-5 h-5 text-green-500" />
      });
    } catch (err) {
      console.error("Upload error:", err);
      
      // Format error message
      let errorMessage = "Upload failed. Please try again.";
      
      if (err.code === 'storage/unauthorized') {
        errorMessage = "Permission denied: Check Firebase Storage security rules. Ensure you're authenticated and have write permissions.";
      } else if (err.code === 'storage/unauthenticated') {
        errorMessage = "Authentication required: Please log in to upload images.";
      } else if (err.code === 'storage/canceled') {
        errorMessage = "Upload was canceled. Please try again.";
      } else if (err.message?.includes('CORS') || err.message?.includes('cors')) {
        errorMessage = "CORS Error: Please configure Firebase Storage CORS for your origin. See console for details.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setUploading(false);
      setProgress(0);
      
      // If we got a downloadURL but Firestore save failed, show warning
      if (downloadURL && !uploadedUrl) {
        toast.error(`Image uploaded but failed to save to database: ${errorMessage}`, { 
          id: "upload",
          duration: 7000,
          icon: <AlertCircle className="w-5 h-5 text-orange-500" />
        });
        // Set the URL anyway so user can see it was uploaded
        setUploadedUrl(downloadURL);
      } else {
        toast.error(errorMessage, { 
          id: "upload",
          duration: 5000,
          icon: <AlertCircle className="w-5 h-5 text-red-500" />
        });
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-3 sm:space-y-4">
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Upload Banner</h2>
      
      {/* File Input */}
      <div className="w-full">
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFile}
          disabled={uploading}
          className="block w-full text-xs sm:text-sm text-gray-500 dark:text-gray-400
            file:mr-2 sm:file:mr-4 file:py-2 sm:file:py-2.5 file:px-3 sm:file:px-4
            file:rounded-lg file:border-0
            file:text-xs sm:file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100 active:file:bg-blue-200
            dark:file:bg-blue-900/30 dark:file:text-blue-300
            disabled:opacity-50 disabled:cursor-not-allowed
            touch-manipulation"
        />
      </div>

      {/* Preview */}
      {preview && (
        <div className="relative w-full">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-40 sm:h-48 md:h-56 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
          />
          {!uploadedUrl && file?.name && (
            <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] sm:text-xs px-2 py-1 rounded max-w-[calc(100%-1rem)] truncate sm:max-w-none sm:whitespace-normal">
              {file.name}
            </div>
          )}
        </div>
      )}

      {/* Progress Bar */}
      {uploading && progress > 0 && (
        <div className="space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-gray-600 dark:text-gray-400">Uploading...</span>
            <span className="font-medium text-gray-900 dark:text-white">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-2.5">
            <div 
              className="bg-blue-600 h-2 sm:h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Authentication Status */}
      {checkingAuth ? (
        <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin flex-shrink-0" />
          <span className="break-words">Checking authentication...</span>
        </div>
      ) : !isAuthenticated ? (
        <div className="p-3 sm:p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-xs sm:text-sm text-yellow-800 dark:text-yellow-300 leading-relaxed">
            ⚠️ You must be logged in to upload images. Please sign in first.
          </p>
        </div>
      ) : null}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!file || uploading || !isAuthenticated || checkingAuth}
        className="w-full px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-blue-600 hover:bg-blue-700 
          active:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed 
          text-white text-sm sm:text-base font-medium
          transition-colors flex items-center justify-center space-x-2
          touch-manipulation min-h-[44px] sm:min-h-[48px]
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {uploading ? (
          <>
            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin flex-shrink-0" />
            <span>Uploading...</span>
          </>
        ) : !isAuthenticated ? (
          <>
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span>Please Sign In</span>
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span>Upload</span>
          </>
        )}
      </button>

      {/* Success - Uploaded URL */}
      {uploadedUrl && (
        <div className="p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg space-y-2 sm:space-y-3">
          <div className="flex items-start space-x-2 sm:space-x-3">
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-green-800 dark:text-green-300 mb-2">
                Image uploaded successfully!
              </p>
              <div className="bg-white dark:bg-gray-700 p-2 sm:p-3 rounded border border-green-200 dark:border-green-800 overflow-hidden">
                <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 dark:text-gray-400 break-all hyphens-auto">
                  {uploadedUrl}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 mt-2 sm:mt-3">
                <button
                  onClick={() => copyToClipboard(uploadedUrl)}
                  className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 sm:space-x-2 
                    px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm 
                    bg-blue-600 hover:bg-blue-700 active:bg-blue-800 
                    text-white rounded-lg transition-colors touch-manipulation
                    min-h-[44px] sm:min-h-[40px]
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span>Copy URL</span>
                </button>
                <a
                  href={uploadedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 sm:space-x-2 
                    px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm 
                    bg-gray-600 hover:bg-gray-700 active:bg-gray-800 
                    text-white rounded-lg transition-colors touch-manipulation
                    min-h-[44px] sm:min-h-[40px]
                    focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span>Open</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && !uploading && (
        <div className="p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-2 sm:space-x-3">
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-red-800 dark:text-red-300 leading-relaxed break-words">
            {error}
          </p>
        </div>
      )}
    </div>
  );
}

