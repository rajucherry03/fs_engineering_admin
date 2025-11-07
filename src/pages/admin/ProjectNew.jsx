import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Save, 
  X,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { useProjects } from '../../hooks/useProjects'
import ImageUpload from '../../components/ui/ImageUpload'
import toast from 'react-hot-toast'

const ProjectNew = () => {
  const navigate = useNavigate()
  const { createProject } = useProjects()
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    analysis: '',
    estimation: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSubmitError(null)
    
    try {
      // Validate required fields
      if (!formData.title.trim()) {
        throw new Error('Project name is required')
      }
      if (!formData.description.trim()) {
        throw new Error('Description is required')
      }

      // Create project with loading indicator
      toast.loading('Creating project...', { id: 'creating-project' })
      
      await createProject(formData)
      
      console.log('Project created successfully, showing confirmation...')
      
      // Success notification with longer duration
      toast.success('Project created successfully!', { 
        id: 'creating-project',
        icon: <CheckCircle className="w-5 h-5 text-green-500" />,
        duration: 3000,
        style: {
          background: '#10b981',
          color: '#fff',
          fontWeight: '500',
          padding: '16px',
          borderRadius: '8px',
          fontSize: '14px'
        }
      })
      
      // Wait longer before navigation to ensure toast is visible
      setTimeout(() => {
        console.log('Navigating to portfolio page...')
        navigate('/admin/portfolio')
      }, 1500)
    } catch (error) {
      console.error('Create project error:', error)
      const errorMessage = error.message || 'Failed to create project. Please try again.'
      setSubmitError(errorMessage)
      toast.error(errorMessage, { 
        id: 'creating-project',
        icon: <AlertCircle className="w-5 h-5 text-red-500" />,
        duration: 5000,
        style: {
          background: '#ef4444',
          color: '#fff',
          fontWeight: '500'
        }
      })
      setLoading(false)
    }
  }


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Portfolio Item</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Add a new project to your portfolio
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/portfolio')}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <X className="w-4 h-4 mr-2 inline" />
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Message */}
        {submitError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800 dark:text-red-300">
                {submitError}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Project Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter project name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Describe your project"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Project Image
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Upload an image from your computer or enter an image URL
                  </p>
                  <ImageUpload
                    value={formData.image}
                    onChange={(value) => setFormData({ ...formData, image: value })}
                    previewClassName="w-full min-h-[300px]"
                    maxSize={5 * 1024 * 1024} // 5MB
                  />
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Project Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Analysis Structure
                  </label>
                  <textarea
                    value={formData.analysis}
                    onChange={(e) => setFormData({ ...formData, analysis: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Describe the analysis, requirements, and structure for this project"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Estimation
                  </label>
                  <input
                    type="text"
                    value={formData.estimation}
                    onChange={(e) => setFormData({ ...formData, estimation: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., 6 months development, $50,000 budget"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Actions</h3>
              
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Create Project
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/admin/portfolio')}
                  disabled={loading}
                  className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ProjectNew
