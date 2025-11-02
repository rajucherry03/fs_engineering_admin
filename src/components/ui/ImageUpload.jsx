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

  const handleFile = (file) => {
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
    
    // Convert to base64 for storage
    setUploading(true)
    const reader = new FileReader()
    reader.onload = (e) => {
      const base64Data = e.target.result
      console.log('File converted to base64, size:', Math.round(base64Data.length / 1024), 'KB')
      onChange(base64Data)
      setUploading(false)
    }
    reader.onerror = () => {
      setError('Failed to read file. Please try again.')
      setUploading(false)
    }
    reader.readAsDataURL(file)
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

  const displayValue = preview || value

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
          <div className={`${previewClassName} rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600`}>
            <ImageWithFallback
              src={displayValue}
              alt="Upload preview"
              className="w-full h-full object-cover"
              fallbackText="📷"
            />
          </div>
          
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
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
            value={value && !preview ? value : ''}
            onChange={(e) => {
              if (!preview) {
                onChange(e.target.value)
                setError(null)
              }
            }}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            disabled={!!preview}
          />
          {preview && (
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ImageUpload
