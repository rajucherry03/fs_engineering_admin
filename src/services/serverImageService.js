/**
 * Server-side Image Upload Service
 * 
 * This service handles image uploads through a server endpoint to avoid CORS issues.
 * You'll need to create a simple Express.js server to handle these requests.
 */

class ServerImageService {
  /**
   * Upload image through server endpoint
   * @param {string} base64Data - Base64 encoded image data
   * @param {string} path - Storage path
   * @param {string} filename - Filename
   * @returns {Promise<string>} - Download URL
   */
  static async uploadImage(base64Data, path, filename) {
    try {
      // Add a timeout to fail fast if server is not running (increased for larger images)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout for larger images
      
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: base64Data,
          path: path,
          filename: filename
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Server error: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }

      const result = await response.json();
      if (!result.downloadURL) {
        throw new Error('Server did not return download URL');
      }
      return result.downloadURL;
    } catch (error) {
      // If it's a network/connection error, throw a specific error that will trigger fallback
      if (error.name === 'AbortError' || 
          error.message.includes('ECONNREFUSED') || 
          error.message.includes('Failed to fetch') ||
          error.message.includes('NetworkError')) {
        throw new Error('Server unavailable - using direct Firebase upload');
      }
      console.error('Server upload failed:', error);
      throw error;
    }
  }

  /**
   * Upload project image through server
   * @param {string} base64Data - Base64 encoded image data
   * @param {string} projectId - Project ID
   * @returns {Promise<string>} - Download URL
   */
  static async uploadProjectImage(base64Data, projectId) {
    // Generate unique filename like the working ecom project
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const filename = `project_${projectId}_${timestamp}_${randomString}.jpg`;
    console.log('Server upload - Generated filename:', filename);
    return this.uploadImage(base64Data, 'projects/images/', filename);
  }

  /**
   * Upload testimonial avatar through server
   * @param {string} base64Data - Base64 encoded image data
   * @param {string} testimonialId - Testimonial ID
   * @returns {Promise<string>} - Download URL
   */
  static async uploadTestimonialAvatar(base64Data, testimonialId) {
    const filename = `avatar_${testimonialId}_${Date.now()}.jpg`;
    return this.uploadImage(base64Data, 'testimonials/avatars/', filename);
  }
}

export default ServerImageService;
