import { useState } from 'react'
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

  const handleError = () => {
    console.log(`Image failed to load: ${src}`)
    setImageError(true)
    setImageLoading(false)
  }

  const handleLoad = () => {
    console.log(`Image loaded successfully: ${src}`)
    setImageLoading(false)
  }

  if (!src || imageError) {
    return (
      <div className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 ${className}`}>
        {fallbackText ? (
          <span className="text-xs font-medium text-center px-1">
            {fallbackText}
          </span>
        ) : (
          <span className="text-lg">{fallbackIcon}</span>
        )}
      </div>
    )
  }

  return (
    <>
      {debug && <ImageDebugger src={src} alt={alt} />}
      <div className={`relative ${className}`}>
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
          </div>
        )}
        <img
          src={src}
          alt={alt}
          className={`${className} ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
          onError={handleError}
          onLoad={handleLoad}
          {...props}
        />
      </div>
    </>
  )
}

export default ImageWithFallback
