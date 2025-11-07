import { useState, useEffect } from 'react'
import ImageDebugger from './ImageDebugger'

const ImageWithFallback = ({ 
  src, 
  alt, 
  className = '', 
  fallbackIcon = '📷', 
  fallbackText = null,
  debug = false,
  ...props 
}) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  const [currentSrcIndex, setCurrentSrcIndex] = useState(0)

  // Convert Google Drive URL to direct image link with fallback options
  const convertGoogleDriveUrl = (url) => {
    if (!url || typeof url !== 'string') return url
    // Check if it's a Google Drive file URL
    const driveFileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
    if (driveFileMatch) {
      const fileId = driveFileMatch[1]
      // Try direct view link (requires file to be publicly shared)
      return `https://drive.google.com/uc?export=view&id=${fileId}`
    }
    return url
  }
  
  // Try alternative Google Drive formats if main one fails
  const getGoogleDriveAlternatives = (url) => {
    const driveFileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
    if (driveFileMatch) {
      const fileId = driveFileMatch[1]
      return [
        // Format 1: Direct view (most common)
        `https://drive.google.com/uc?export=view&id=${fileId}`,
        // Format 2: Thumbnail with size
        `https://drive.google.com/thumbnail?id=${fileId}&sz=w2000`,
        // Format 3: Alternative thumbnail format
        `https://drive.google.com/thumbnail?id=${fileId}&authuser=0&sz=w2000`,
        // Format 4: Googleusercontent format
        `https://lh3.googleusercontent.com/d/${fileId}=w2000`,
        // Format 5: Download format (if publicly accessible)
        `https://drive.google.com/uc?export=download&id=${fileId}`,
        // Format 6: Open format
        `https://drive.google.com/file/d/${fileId}/preview`
      ]
    }
    return [url]
  }

  // Get the display URL (convert Google Drive if needed)
  const baseDisplaySrc = src && !src.startsWith('data:image/') ? convertGoogleDriveUrl(src) : src
  const alternatives = baseDisplaySrc && baseDisplaySrc.includes('drive.google.com') 
    ? getGoogleDriveAlternatives(src) 
    : [baseDisplaySrc]
  const displaySrc = alternatives[currentSrcIndex] || baseDisplaySrc

  // Reset source index when src changes
  useEffect(() => {
    setCurrentSrcIndex(0)
    setImageError(false)
    setImageLoading(true)
  }, [src])

  const handleError = () => {
    console.log(`Image failed to load: ${displaySrc}`)
    // Try next alternative if available
    if (alternatives.length > currentSrcIndex + 1) {
      console.log(`Trying alternative Google Drive URL format...`)
      setCurrentSrcIndex(currentSrcIndex + 1)
      setImageLoading(true)
      setImageError(false)
    } else {
      setImageError(true)
      setImageLoading(false)
      console.error(`All Google Drive URL formats failed. Make sure the file is publicly shared.`)
    }
  }

  const handleLoad = () => {
    console.log(`Image loaded successfully: ${displaySrc}`)
    setImageLoading(false)
  }

  if (!displaySrc || imageError) {
    const isGoogleDrive = src && src.includes('drive.google.com')
    return (
      <div className={`bg-gray-200 dark:bg-gray-700 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 ${className}`}>
        {fallbackText ? (
          <span className="text-xs font-medium text-center px-1">
            {fallbackText}
          </span>
        ) : (
          <span className="text-lg mb-1">{fallbackIcon}</span>
        )}
        {isGoogleDrive && imageError && (
          <div className="text-[10px] text-center px-2 mt-1 text-amber-600 dark:text-amber-400 space-y-0.5 max-w-full">
            <p className="font-medium">Google Drive images cannot be embedded</p>
            <p className="text-[9px] opacity-75 mt-1">
              Google blocks direct image embedding. Please download the image and upload it directly, or use Imgur/Cloudinary.
            </p>
          </div>
        )}
      </div>
    )
  }

  // Check if src is a URL (not base64)
  const isUrl = displaySrc && !displaySrc.startsWith('data:image/')
  
  return (
    <>
      {debug && <ImageDebugger src={displaySrc} alt={alt} />}
      <div className={`relative ${className}`}>
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
          </div>
        )}
        <img
          src={displaySrc}
          alt={alt}
          className={`${className} ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
          onError={handleError}
          onLoad={handleLoad}
          crossOrigin={isUrl && !displaySrc.includes('drive.google.com') ? "anonymous" : undefined}
          loading="lazy"
          referrerPolicy="no-referrer"
          {...props}
        />
      </div>
    </>
  )
}

export default ImageWithFallback
