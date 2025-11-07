import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProjects } from '../../hooks/useProjects'
import ImageWithFallback from '../../components/ui/ImageWithFallback'
import ImageUpload from '../../components/ui/ImageUpload'
import { 
  ArrowLeft, 
  Save, 
  X
} from 'lucide-react'
import toast from 'react-hot-toast'

const ProjectEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { projects, updateProject } = useProjects()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    analysis: '',
    estimation: '',
    status: 'draft'
  })

  useEffect(() => {
    const project = projects.find(p => p.id === id)
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        image: project.image || '',
        analysis: project.analysis || '',
        estimation: project.estimation || '',
        status: project.status || 'draft'
      })
    }
  }, [projects, id])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      toast.loading('Updating project...', { id: 'updating-project' })
      await updateProject(id, formData)
      
      console.log('Project updated successfully, showing confirmation...')
      
      // Show success message with longer duration
      toast.success('Project updated successfully!', { 
        id: 'updating-project',
        duration: 3000,
        icon: '✅',
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
      console.error('Update project error:', error)
      const errorMessage = error.message || 'Failed to update project. Please try again.'
      toast.error(errorMessage, { 
        id: 'updating-project',
        duration: 5000,
        icon: '❌',
        style: {
          background: '#ef4444',
          color: '#fff',
          fontWeight: '500'
        }
      })
      setLoading(false)
    }
  }

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'completed', label: 'Completed' },
    { value: 'on_hold', label: 'On Hold' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/portfolio')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Project</h1>
            <p className="text-gray-600 dark:text-gray-400">Update project details and settings</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate('/admin/portfolio')}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="project-edit-form"
            disabled={loading}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      <form id="project-edit-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter project title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Brief description of the project"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Project Image
                  </label>
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
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Project Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Analysis Structure
                  </label>
                  <textarea
                    name="analysis"
                    value={formData.analysis}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Describe the analysis, requirements, and structure for this project"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Estimation
                  </label>
                  <input
                    type="text"
                    name="estimation"
                    value={formData.estimation}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., 6 months development, $50,000 budget"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Project Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Project Preview */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Preview</h3>
              
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <ImageWithFallback
                    src={formData.image}
                    alt="Project preview"
                    className="w-12 h-12 rounded-lg"
                    fallbackText={formData.title ? formData.title.charAt(0).toUpperCase() : 'P'}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {formData.title || 'Project Title'}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                      {formData.description || 'Project description'}
                    </p>
                    <div className="flex items-center mt-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        formData.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                        formData.status === 'ongoing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                        formData.status === 'draft' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                      }`}>
                        {formData.status?.replace('_', ' ') || 'draft'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ProjectEdit

