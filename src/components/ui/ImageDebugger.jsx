import { useState, useEffect } from 'react'

const ImageDebugger = ({ src, alt }) => {
  const [debugInfo, setDebugInfo] = useState({
    loading: false,
    loaded: false,
    error: false,
    errorMessage: null,
    loadTime: null
  })

  useEffect(() => {
    if (!src) return

    const startTime = Date.now()
    setDebugInfo(prev => ({ ...prev, loading: true, error: false }))

    const img = new Image()
    
    img.onload = () => {
      const loadTime = Date.now() - startTime
      console.log(`✅ Image loaded successfully: ${src} (${loadTime}ms)`)
      setDebugInfo(prev => ({ 
        ...prev, 
        loading: false, 
        loaded: true, 
        loadTime 
      }))
    }

    img.onerror = (error) => {
      const loadTime = Date.now() - startTime
      console.error(`❌ Image failed to load: ${src} (${loadTime}ms)`, error)
      setDebugInfo(prev => ({ 
        ...prev, 
        loading: false, 
        error: true, 
        errorMessage: error.message || 'Unknown error',
        loadTime 
      }))
    }

    img.src = src

    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [src])

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white text-xs p-2 rounded max-w-xs z-50">
      <div className="font-bold mb-1">Image Debug Info</div>
      <div>URL: {src || 'No URL'}</div>
      <div>Alt: {alt || 'No alt'}</div>
      <div>Status: {
        debugInfo.loading ? '🔄 Loading...' :
        debugInfo.loaded ? '✅ Loaded' :
        debugInfo.error ? '❌ Error' : '⏸️ Idle'
      }</div>
      {debugInfo.loadTime && (
        <div>Load Time: {debugInfo.loadTime}ms</div>
      )}
      {debugInfo.errorMessage && (
        <div>Error: {debugInfo.errorMessage}</div>
      )}
    </div>
  )
}

export default ImageDebugger
