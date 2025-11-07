import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react'
import ImageWithFallback from './ImageWithFallback'

const ImageUpload = ({ 
  value, 
  onChange, 
  className = '', 
  previewClassName = 'w-20 h-20',
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB
  ...props 
}) => {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState(null)
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  // Compress image to fit within Firestore's 1MB limit
  const compressImage = (file, maxWidth = 1200, maxHeight = 1200, maxSizeKB = 800) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        const img = new Image()
        
        img.onload = () => {
          // Calculate new dimensions
          let width = img.width
          let height = img.height
          
          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = (height * maxWidth) / width
              width = maxWidth
            } else {
              width = (width * maxHeight) / height
              height = maxHeight
            }
          }
          
          // Create canvas
          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          
          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height)
          
          // Try different quality levels until we get under the size limit
          // Firestore counts the entire base64 string length, so we check base64Data.length directly
          let quality = 0.9
          let base64Data = canvas.toDataURL('image/jpeg', quality)
          let sizeKB = base64Data.length / 1024
          
          // If still too large, reduce quality progressively
          while (sizeKB > maxSizeKB && quality > 0.1) {
            quality -= 0.1
            base64Data = canvas.toDataURL('image/jpeg', quality)
            sizeKB = base64Data.length / 1024
          }
          
          // Final check - if still too large, resize more aggressively
          if (sizeKB > maxSizeKB) {
            // Reduce dimensions by 50% and try again
            canvas.width = width * 0.5
            canvas.height = height * 0.5
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
            quality = 0.7
            base64Data = canvas.toDataURL('image/jpeg', quality)
            sizeKB = base64Data.length / 1024
          }
          
          console.log('Image compressed:', {
            original: `${Math.round(file.size / 1024)}KB`,
            base64Size: `${Math.round(sizeKB)}KB`,
            dimensions: `${Math.round(width)}x${Math.round(height)}`,
            quality: Math.round(quality * 100) + '%'
          })
          
          resolve(base64Data)
        }
        
        img.onerror = () => {
          reject(new Error('Failed to load image'))
        }
        
        img.src = e.target.result
      }
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'))
      }
      
      reader.readAsDataURL(file)
    })
  }

  const handleFile = async (file) => {
    setError(null)
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }
    
    // Validate file size
    if (file.size > maxSize) {
      setError(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`)
      return
    }
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file)
    setPreview(previewUrl)
    
    // Compress and convert to base64 for storage
    setUploading(true)
    
    try {
      const base64Data = await compressImage(file)
      // Check actual base64 string size (Firestore counts the entire string)
      const base64SizeKB = base64Data.length / 1024
      
      // Final safety check - Firestore limit is 1MB (1024KB) for the entire field value
      if (base64SizeKB > 1000) {
        setError(`Image is too large even after compression (${Math.round(base64SizeKB)}KB). Please use a smaller image.`)
        setUploading(false)
        return
      }
      
      console.log('File converted to base64, size:', Math.round(base64SizeKB), 'KB')
      onChange(base64Data)
      setUploading(false)
    } catch (err) {
      console.error('Image compression error:', err)
      setError(err.message || 'Failed to process image. Please try again.')
      setUploading(false)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemove = () => {
    if (preview) {
      URL.revokeObjectURL(preview)
    }
    setPreview(null)
    onChange('')
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Convert Google Drive URL to direct image link
  const convertGoogleDriveUrl = (url) => {
    // Check if it's a Google Drive file URL
    const driveFileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
    if (driveFileMatch) {
      const fileId = driveFileMatch[1]
      // Try multiple Google Drive URL formats
      // Format 1: Direct view (requires file to be publicly shared)
      // Format 2: Thumbnail (smaller but more reliable)
      // Format 3: Download (if file is publicly accessible)
      return `https://drive.google.com/uc?export=view&id=${fileId}`
    }
    return url
  }

  // Handle URL validation and preview
  const handleUrlChange = (url) => {
    const trimmedUrl = url.trim()
    
    if (!trimmedUrl) {
      onChange('')
      setError(null)
      setPreview(null)
      return
    }

    // Validate URL format
    try {
      new URL(trimmedUrl)
      // Convert Google Drive URLs to direct image links
      const convertedUrl = convertGoogleDriveUrl(trimmedUrl)
      // Valid URL - store it directly and show preview
      onChange(convertedUrl)
      setError(null)
      // Preview will be handled by displayValue using the URL directly
    } catch (err) {
      // Invalid URL format
      setError('Please enter a valid URL (e.g., https://example.com/image.jpg)')
    }
  }

  // Check if value is a URL (not base64)
  const isUrl = (val) => {
    if (!val) return false
    if (val.startsWith('data:image/')) return false // base64
    try {
      new URL(val)
      return true
    } catch {
      return false
    }
  }

  // Determine what to display: preview (from file upload) or value (base64 or URL)
  // Convert Google Drive URLs for display if needed
  const getDisplayValue = () => {
    if (preview) return preview
    if (value && isUrl(value)) {
      return convertGoogleDriveUrl(value)
    }
    return value
  }
  
  const displayValue = getDisplayValue()

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-4 transition-colors cursor-pointer
          ${dragActive 
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }
          ${error ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
          {...props}
        />
        
        <div className="text-center">
          <div className="mx-auto w-12 h-12 mb-3 flex items-center justify-center">
            {uploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            ) : dragActive ? (
              <Upload className="w-8 h-8 text-primary-500" />
            ) : (
              <ImageIcon className="w-8 h-8 text-gray-400" />
            )}
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            {uploading ? 'Processing image...' : dragActive ? 'Drop the image here' : 'Click to upload or drag and drop'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            PNG, JPG, GIF up to {Math.round(maxSize / 1024 / 1024)}MB
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center text-red-600 dark:text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 mr-2" />
          {error}
        </div>
      )}

      {/* Preview */}
      {displayValue && (
        <div className="relative">
          <div className={`${previewClassName || 'w-full min-h-[300px]'} rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 flex items-center justify-center`}>
            <ImageWithFallback
              src={displayValue}
              alt={preview ? "Upload preview" : isUrl(value) ? "URL image" : "Image preview"}
              className={`w-full h-full ${isUrl(value) ? 'object-contain max-h-[500px]' : 'object-cover'}`}
              fallbackText="📷"
            />
          </div>
          
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors z-10"
            title="Remove image"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* URL Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Or enter image URL
        </label>
        <div className="flex space-x-2">
          <input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={value && !preview && !value.startsWith('data:') ? value : ''}
            onChange={(e) => {
              if (!preview) {
                handleUrlChange(e.target.value)
              }
            }}
            onBlur={(e) => {
              if (!preview) {
                handleUrlChange(e.target.value)
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !preview) {
                e.preventDefault()
                handleUrlChange(e.target.value)
              }
            }}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            disabled={!!preview}
          />
          {(preview || value) && (
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
            >
              Clear
            </button>
          )}
        </div>
        {value && isUrl(value) && (
          <div className="space-y-1">
            {!value.includes('drive.google.com') ? (
              <p className="text-xs text-green-600 dark:text-green-400">
                ✓ URL image will be displayed directly
              </p>
            ) : (
              <div className="text-xs text-amber-600 dark:text-amber-400 space-y-1 p-2 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800">
                <p className="font-medium">⚠️ Google Drive URLs don't work for direct image display</p>
                <p className="text-[10px] mt-1">
                  <strong>Solution:</strong> Download the image from Google Drive and upload it directly using the upload area above, or use an image hosting service (Imgur, Cloudinary, etc.) and paste that URL instead.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ImageUpload
