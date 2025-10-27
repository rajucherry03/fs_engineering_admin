import React, { useState, useCallback } from 'react'
import { Upload, X, File, Image, FileText, Video, Music, Archive, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const FileUpload = ({
  onUpload,
  onRemove,
  files = [],
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB
  acceptedTypes = ['image/*', 'application/pdf', '.doc', '.docx'],
  multiple = true,
  className = ""
}) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({})
  const [errors, setErrors] = useState([])

  const getFileIcon = (file) => {
    const type = file.type || ''
    if (type.startsWith('image/')) return <Image className="w-5 h-5" />
    if (type.startsWith('video/')) return <Video className="w-5 h-5" />
    if (type.startsWith('audio/')) return <Music className="w-5 h-5" />
    if (type.includes('pdf')) return <FileText className="w-5 h-5" />
    if (type.includes('zip') || type.includes('rar')) return <Archive className="w-5 h-5" />
    return <File className="w-5 h-5" />
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const validateFile = (file) => {
    const errors = []
    
    // Check file size
    if (file.size > maxSize) {
      errors.push(`${file.name} is too large. Maximum size is ${formatFileSize(maxSize)}`)
    }
    
    // Check file type
    const isValidType = acceptedTypes.some(type => {
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type.toLowerCase())
      }
      return file.type.match(type.replace('*', '.*'))
    })
    
    if (!isValidType) {
      errors.push(`${file.name} is not an accepted file type`)
    }
    
    return errors
  }

  const handleFiles = useCallback((newFiles) => {
    const fileArray = Array.from(newFiles)
    const validFiles = []
    const newErrors = []

    // Check max files limit
    if (files.length + fileArray.length > maxFiles) {
      newErrors.push(`Maximum ${maxFiles} files allowed`)
      setErrors(newErrors)
      return
    }

    fileArray.forEach(file => {
      const fileErrors = validateFile(file)
      if (fileErrors.length === 0) {
        validFiles.push(file)
      } else {
        newErrors.push(...fileErrors)
      }
    })

    if (validFiles.length > 0) {
      onUpload(validFiles)
    }

    if (newErrors.length > 0) {
      setErrors(newErrors)
      setTimeout(() => setErrors([]), 5000)
    }
  }, [files.length, maxFiles, maxSize, acceptedTypes, onUpload])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(false)
    const droppedFiles = e.dataTransfer.files
    handleFiles(droppedFiles)
  }, [handleFiles])

  const handleFileInput = useCallback((e) => {
    const selectedFiles = e.target.files
    handleFiles(selectedFiles)
    e.target.value = '' // Reset input
  }, [handleFiles])

  const handleRemoveFile = (index) => {
    onRemove(index)
  }

  const simulateUpload = (file, index) => {
    setUploadProgress(prev => ({ ...prev, [index]: 0 }))
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const current = prev[index] || 0
        const next = Math.min(current + Math.random() * 30, 100)
        
        if (next >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setUploadProgress(prev => {
              const newProgress = { ...prev }
              delete newProgress[index]
              return newProgress
            })
          }, 1000)
        }
        
        return { ...prev, [index]: next }
      })
    }, 200)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          isDragOver
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
        }`}
      >
        <motion.div
          animate={{ scale: isDragOver ? 1.05 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <Upload className={`w-12 h-12 mx-auto mb-4 ${
            isDragOver ? 'text-blue-500' : 'text-gray-400'
          }`} />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {isDragOver ? 'Drop files here' : 'Upload Files'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Drag and drop files here, or click to select files
          </p>
          <input
            type="file"
            multiple={multiple}
            accept={acceptedTypes.join(',')}
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4 mr-2" />
            Choose Files
          </label>
        </motion.div>
      </div>

      {/* Error Messages */}
      <AnimatePresence>
        {errors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <X className="w-5 h-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Upload Errors
                </h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  <ul className="list-disc list-inside space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              Uploaded Files ({files.length})
            </h4>
            <div className="space-y-2">
              {files.map((file, index) => (
                <motion.div
                  key={`${file.name}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-gray-500 dark:text-gray-400">
                      {getFileIcon(file)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {/* Upload Progress */}
                    {uploadProgress[index] !== undefined && (
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-1">
                          <div
                            className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress[index]}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {Math.round(uploadProgress[index])}%
                        </span>
                      </div>
                    )}
                    
                    {/* Success Check */}
                    {uploadProgress[index] === 100 && (
                      <Check className="w-4 h-4 text-green-500" />
                    )}
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* File Type Info */}
      <div className="text-xs text-gray-500 dark:text-gray-400">
        <p>Accepted file types: {acceptedTypes.join(', ')}</p>
        <p>Maximum file size: {formatFileSize(maxSize)}</p>
        <p>Maximum files: {maxFiles}</p>
      </div>
    </div>
  )
}

export default FileUpload
