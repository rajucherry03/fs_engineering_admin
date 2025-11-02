import { storage, auth } from '../firebase/config'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { onAuthStateChanged } from 'firebase/auth'
import ServerImageService from './serverImageService.js'

class ImageService {
  /**
   * Wait for authentication to be ready
   * @returns {Promise<void>}
   */
  static async waitForAuth() {
    if (auth.currentUser) {
      return Promise.resolve()
    }
    
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        unsubscribe()
        reject(new Error('Authentication timeout: Please ensure you are logged in.'))
      }, 5000)
      
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          clearTimeout(timeout)
          unsubscribe()
          resolve()
        }
      })
    })
  }

  /**
   * Upload a base64 image to Firebase Storage
   * @param {string} base64Data - Base64 encoded image data
   * @param {string} path - Storage path (e.g., 'projects/images/')
   * @param {string} filename - Filename for the image
   * @returns {Promise<string>} - Download URL of the uploaded image
   */
  static async uploadBase64Image(base64Data, path, filename) {
    try {
      // Ensure user is authenticated before uploading
      await this.waitForAuth()
      
      if (!auth.currentUser) {
        throw new Error('User must be authenticated to upload images')
      }

      console.log('User authenticated, proceeding with upload...', {
        uid: auth.currentUser.uid,
        email: auth.currentUser.email
      })

      // Convert base64 data URL to blob
      // Remove the data URL prefix if present
      const base64String = base64Data.includes(',') 
        ? base64Data.split(',')[1] 
        : base64Data
      
      // Convert base64 string to blob
      const byteCharacters = atob(base64String)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      
      // Determine content type from data URL or default to jpeg
      let contentType = 'image/jpeg'
      if (base64Data.startsWith('data:')) {
        const match = base64Data.match(/data:([^;]+);/)
        if (match) {
          contentType = match[1] || 'image/jpeg'
        }
      }
      
      const blob = new Blob([byteArray], { type: contentType })
      
      console.log('Blob created, size:', blob.size, 'bytes, type:', contentType)
      
      // Create storage reference
      const storageRef = ref(storage, `${path}${filename}`)
      
      console.log('Storage reference created:', `${path}${filename}`)
      
      // Upload the blob with metadata
      const metadata = {
        contentType: contentType,
        customMetadata: {
          uploadedAt: new Date().toISOString(),
          uploadedBy: auth.currentUser.email || 'admin',
          userId: auth.currentUser.uid
        }
      }
      
      console.log('Starting upload to Firebase Storage...')
      const snapshot = await uploadBytes(storageRef, blob, metadata)
      console.log('Upload complete, getting download URL...')
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref)
      
      console.log('Image uploaded successfully to Firebase Storage:', downloadURL)
      return downloadURL
    } catch (error) {
      console.error('Error uploading image to Firebase Storage:', error)
      console.error('Error code:', error.code)
      console.error('Error message:', error.message)
      console.error('Current auth state:', auth.currentUser ? {
        uid: auth.currentUser.uid,
        email: auth.currentUser.email
      } : 'Not authenticated')
      
      // Provide helpful error messages
      if (error.code === 'storage/unauthorized') {
        throw new Error('Permission denied: Please check Firebase Storage security rules. Ensure your user is authenticated and has write permissions.')
      } else if (error.code === 'storage/quota-exceeded') {
        throw new Error('Storage quota exceeded: Please check your Firebase Storage quota.')
      } else if (error.code === 'storage/unauthenticated') {
        throw new Error('Authentication required: Please log in to upload images.')
      } else if (error.code === 'storage/canceled') {
        throw new Error('Upload was canceled. Please try again.')
      } else if (error.message && (error.message.includes('CORS') || error.message.includes('cors'))) {
        throw new Error('CORS Error: Please check Firebase Storage security rules and CORS configuration. Make sure CORS is configured for your origin.')
      } else if (error.message && error.message.includes('network')) {
        throw new Error('Network error: Please check your internet connection and try again.')
      }
      
      throw new Error(`Image upload failed: ${error.message || error.code || 'Unknown error'}. Please check your Firebase Storage configuration and ensure you are logged in.`)
    }
  }

  /**
   * Upload a file to Firebase Storage
   * @param {File} file - File object to upload
   * @param {string} path - Storage path (e.g., 'projects/images/')
   * @param {string} filename - Filename for the image
   * @returns {Promise<string>} - Download URL of the uploaded image
   */
  static async uploadFile(file, path, filename) {
    try {
      // Create storage reference
      const storageRef = ref(storage, `${path}${filename}`)
      
      // Upload the file
      const snapshot = await uploadBytes(storageRef, file)
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref)
      
      console.log('File uploaded successfully:', downloadURL)
      return downloadURL
    } catch (error) {
      console.error('Error uploading file:', error)
      throw error
    }
  }

  /**
   * Delete an image from Firebase Storage
   * @param {string} imageUrl - Full URL of the image to delete
   * @returns {Promise<void>}
   */
  static async deleteImage(imageUrl) {
    try {
      // Extract the path from the URL
      const url = new URL(imageUrl)
      const path = decodeURIComponent(url.pathname.split('/o/')[1].split('?')[0])
      
      // Create storage reference
      const imageRef = ref(storage, path)
      
      // Delete the file
      await deleteObject(imageRef)
      
      console.log('Image deleted successfully:', imageUrl)
    } catch (error) {
      console.error('Error deleting image:', error)
      throw error
    }
  }

  /**
   * Generate a unique filename with timestamp
   * @param {string} originalName - Original filename
   * @returns {string} - Unique filename
   */
  static generateUniqueFilename(originalName) {
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const extension = originalName.split('.').pop()
    return `${timestamp}_${randomString}.${extension}`
  }

  /**
   * Check if a URL is a Firebase Storage URL
   * @param {string} url - URL to check
   * @returns {boolean}
   */
  static isFirebaseStorageUrl(url) {
    return url.includes('firebasestorage.googleapis.com')
  }

  /**
   * Upload image for projects
   * @param {string} base64Data - Base64 encoded image data
   * @param {string} projectId - Project ID
   * @returns {Promise<string>} - Download URL
   */
  static async uploadProjectImage(base64Data, projectId) {
    // Use server-side upload FIRST (like ecom project) to avoid CORS issues
    try {
      console.log('Starting project image upload via server (ecom pattern) for project:', projectId)
      const url = await ServerImageService.uploadProjectImage(base64Data, projectId)
      console.log('Project image uploaded successfully via server:', url)
      return url
    } catch (serverError) {
      console.warn('Server upload failed, trying direct Firebase Storage upload:', {
        error: serverError.message
      })
      
      // Fallback to direct Firebase upload if server is not available
      try {
        console.log('Attempting direct Firebase Storage upload as fallback...')
        const filename = this.generateUniqueFilename(`project_${projectId}.jpg`)
        console.log('Generated filename:', filename)
        const url = await this.uploadBase64Image(base64Data, 'projects/images/', filename)
        console.log('Project image uploaded successfully via direct upload:', url)
        return url
      } catch (directUploadError) {
        console.error('Both server and direct upload failed:', {
          serverError: serverError.message,
          directError: directUploadError.message
        })
        // Provide a comprehensive error message
        throw new Error(`Failed to upload image: ${serverError.message || directUploadError.message || 'Unknown error'}. Please ensure the upload server is running or Firebase Storage is properly configured.`)
      }
    }
  }

  /**
   * Upload avatar for testimonials
   * @param {string} base64Data - Base64 encoded image data
   * @param {string} testimonialId - Testimonial ID
   * @returns {Promise<string>} - Download URL
   */
  static async uploadTestimonialAvatar(base64Data, testimonialId) {
    const filename = this.generateUniqueFilename(`avatar_${testimonialId}.jpg`)
    return this.uploadBase64Image(base64Data, 'testimonials/avatars/', filename)
  }

  /**
   * Upload image for content
   * @param {string} base64Data - Base64 encoded image data
   * @param {string} contentType - Type of content (pages, services, blog)
   * @param {string} contentId - Content ID
   * @returns {Promise<string>} - Download URL
   */
  static async uploadContentImage(base64Data, contentType, contentId) {
    const filename = this.generateUniqueFilename(`${contentType}_${contentId}.jpg`)
    return this.uploadBase64Image(base64Data, `content/${contentType}/images/`, filename)
  }
}

export default ImageService
