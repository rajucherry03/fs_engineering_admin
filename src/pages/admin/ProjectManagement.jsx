import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProjects } from '../../hooks/useProjects'
import ImageWithFallback from '../../components/ui/ImageWithFallback'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  Archive,
  CheckCircle,
  Clock,
  AlertCircle,
  FolderOpen,
  X
} from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

const ProjectManagement = () => {
  const navigate = useNavigate()
  const { projects, loading, deleteProject, bulkDeleteProjects, bulkUpdateProjects } = useProjects()
  const [selectedProjects, setSelectedProjects] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [selectedProjectForModal, setSelectedProjectForModal] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase())
    // Removed technologies filter since that field was removed
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleSelectProject = (projectId) => {
    setSelectedProjects(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    )
  }

  const handleSelectAll = () => {
    if (selectedProjects.length === filteredProjects.length) {
      setSelectedProjects([])
    } else {
      setSelectedProjects(filteredProjects.map(p => p.id))
    }
  }

  const handleBulkDelete = async () => {
    if (selectedProjects.length === 0) return
    
    if (!window.confirm(`Are you sure you want to delete ${selectedProjects.length} project(s)? This action cannot be undone.`)) {
      return
    }
    
    try {
      toast.loading(`Deleting ${selectedProjects.length} project(s)...`, { id: 'bulk-delete' })
      const count = selectedProjects.length
      await bulkDeleteProjects(selectedProjects)
      setSelectedProjects([])
      setShowBulkActions(false)
      toast.success(`${count} project(s) deleted successfully!`, { 
        id: 'bulk-delete',
        duration: 4000
      })
    } catch (error) {
      const errorMessage = error.message || 'Failed to delete projects. Please try again.'
      toast.error(errorMessage, { 
        id: 'bulk-delete',
        duration: 5000
      })
    }
  }

  const handleBulkStatusUpdate = async (status) => {
    if (selectedProjects.length === 0) return
    
    try {
      await bulkUpdateProjects(selectedProjects, { status: status })
      setSelectedProjects([])
      setShowBulkActions(false)
      toast.success(`Projects updated to ${status}`)
    } catch (error) {
      toast.error('Failed to update projects')
    }
  }

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        toast.loading('Deleting project...', { id: 'delete-project' })
        await deleteProject(projectId)
        toast.success('Project deleted successfully!', { 
          id: 'delete-project',
          duration: 4000
        })
      } catch (error) {
        const errorMessage = error.message || 'Failed to delete project. Please try again.'
        toast.error(errorMessage, { 
          id: 'delete-project',
          duration: 5000
        })
      }
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'ongoing':
        return <Clock className="w-4 h-4 text-blue-500" />
      case 'draft':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'on_hold':
        return <AlertCircle className="w-4 h-4 text-orange-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'ongoing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'on_hold':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Portfolio Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and organize your portfolio items
          </p>
        </div>
        <button 
          onClick={() => navigate('/admin/portfolio/new')}
          className="mt-4 sm:mt-0 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search portfolio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="on_hold">On Hold</option>
            </select>
            <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedProjects.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary-50 dark:bg-primary-900 rounded-lg p-4 border border-primary-200 dark:border-primary-700"
        >
          <div className="flex items-center justify-between">
            <span className="text-primary-700 dark:text-primary-300 font-medium">
              {selectedProjects.length} item{selectedProjects.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkStatusUpdate('completed')}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded"
              >
                Mark Complete
              </button>
              <button
                onClick={() => handleBulkStatusUpdate('ongoing')}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
              >
                Mark Ongoing
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded"
              >
                Delete
              </button>
              <button
                onClick={() => setSelectedProjects([])}
                className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Projects Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedProjects.length === filteredProjects.length && filteredProjects.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Technologies
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Featured
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProjects.map((project) => (
                <motion.tr
                  key={project.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedProjects.includes(project.id)}
                      onChange={() => handleSelectProject(project.id)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <button
                        type="button"
                        className="flex-shrink-0 focus:outline-none"
                        onClick={() => {
                          setSelectedProjectForModal(project)
                          setShowDetailsModal(true)
                        }}
                        title="View details"
                      >
                        <ImageWithFallback
                          src={project.image}
                          alt={project.title}
                          className="h-12 w-12 rounded-lg object-cover"
                          fallbackText={project.title ? project.title.charAt(0).toUpperCase() : 'P'}
                        />
                      </button>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {project.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                          {project.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {getStatusIcon(project.status)}
                      <span className="ml-1 capitalize">{project.status.replace('_', ' ')}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {project.category}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {project.technologies?.slice(0, 3).map((tech, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies?.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {project.featured ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                        ⭐ Featured
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {project.views || 0}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => navigate(`/admin/portfolio/edit/${project.id}`)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        title="Edit project"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        title="View details"
                        onClick={() => {
                          setSelectedProjectForModal(project)
                          setShowDetailsModal(true)
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteProject(project.id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No portfolio items found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Get started by creating a new portfolio item.
          </p>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedProjectForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowDetailsModal(false)}
          />
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-3xl w-full mx-4 overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedProjectForModal.title || 'Portfolio Item'}
              </h2>
              <button
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
                onClick={() => setShowDetailsModal(false)}
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <ImageWithFallback
                  src={selectedProjectForModal.image}
                  alt={selectedProjectForModal.title}
                  className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                  fallbackText={selectedProjectForModal.title ? selectedProjectForModal.title.charAt(0).toUpperCase() : 'P'}
                />
                <div className="mt-4 space-y-2">
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Category:</span> {selectedProjectForModal.category || '-'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Status:</span> <span className="capitalize">{selectedProjectForModal.status?.replace('_',' ') || '-'}</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Featured:</span> {selectedProjectForModal.featured ? 'Yes' : 'No'}
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Description</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{selectedProjectForModal.description || '-'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Analysis</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{selectedProjectForModal.analysis || '-'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Structure</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{selectedProjectForModal.structure || '-'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Estimation</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{selectedProjectForModal.estimation || '-'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Technologies</h3>
                  <div className="flex flex-wrap gap-1">
                    {selectedProjectForModal.technologies?.length
                      ? selectedProjectForModal.technologies.map((tech, idx) => (
                          <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                            {tech}
                          </span>
                        ))
                      : <span className="text-sm text-gray-700 dark:text-gray-300">-</span>}
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end gap-2">
              <button
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg"
                onClick={() => {
                  setShowDetailsModal(false)
                  navigate(`/admin/portfolio/edit/${selectedProjectForModal.id}`)
                }}
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectManagement

/* Details Modal */
// Render modal at the end to avoid layout issues

