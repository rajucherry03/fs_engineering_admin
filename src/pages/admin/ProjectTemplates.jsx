import { useState } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Copy,
  Eye,
  MoreVertical,
  FileText,
  Download
} from 'lucide-react'
import { motion } from 'framer-motion'

const ProjectTemplates = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState(null)
  const [newTemplate, setNewTemplate] = useState({ 
    name: '', 
    description: '', 
    category: '',
    tasks: [],
    estimatedHours: '',
    isPublic: false
  })

  // Mock data - replace with real data from your service
  const templates = [
    {
      id: '1',
      name: 'Web Development Template',
      description: 'Complete template for web development projects',
      category: 'Web Development',
      estimatedHours: 40,
      tasks: ['Planning', 'Design', 'Development', 'Testing', 'Deployment'],
      isPublic: true,
      usageCount: 15,
      createdAt: '2024-01-01'
    },
    {
      id: '2',
      name: 'Mobile App Template',
      description: 'Template for mobile application development',
      category: 'Mobile App',
      estimatedHours: 60,
      tasks: ['Research', 'Wireframing', 'UI Design', 'Development', 'Testing', 'App Store Submission'],
      isPublic: true,
      usageCount: 8,
      createdAt: '2024-01-02'
    },
    {
      id: '3',
      name: 'Design Project Template',
      description: 'Template for design projects and creative work',
      category: 'Design',
      estimatedHours: 20,
      tasks: ['Briefing', 'Research', 'Concept Development', 'Design', 'Review', 'Final Delivery'],
      isPublic: false,
      usageCount: 3,
      createdAt: '2024-01-03'
    }
  ]

  const categories = ['Web Development', 'Mobile App', 'Design', 'Marketing', 'Research']

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddTemplate = () => {
    // Add template logic here
    console.log('Adding template:', newTemplate)
    setNewTemplate({ 
      name: '', 
      description: '', 
      category: '',
      tasks: [],
      estimatedHours: '',
      isPublic: false
    })
    setShowAddForm(false)
  }

  const handleEditTemplate = (template) => {
    setEditingTemplate(template)
    setNewTemplate({
      name: template.name,
      description: template.description,
      category: template.category,
      tasks: template.tasks,
      estimatedHours: template.estimatedHours,
      isPublic: template.isPublic
    })
    setShowAddForm(true)
  }

  const handleUpdateTemplate = () => {
    // Update template logic here
    console.log('Updating template:', editingTemplate.id, newTemplate)
    setEditingTemplate(null)
    setNewTemplate({ 
      name: '', 
      description: '', 
      category: '',
      tasks: [],
      estimatedHours: '',
      isPublic: false
    })
    setShowAddForm(false)
  }

  const handleDeleteTemplate = (templateId) => {
    // Delete template logic here
    console.log('Deleting template:', templateId)
  }

  const handleUseTemplate = (template) => {
    // Use template logic here
    console.log('Using template:', template)
  }

  const handleAddTask = () => {
    setNewTemplate({ ...newTemplate, tasks: [...newTemplate.tasks, ''] })
  }

  const handleTaskChange = (index, value) => {
    const newTasks = [...newTemplate.tasks]
    newTasks[index] = value
    setNewTemplate({ ...newTemplate, tasks: newTasks })
  }

  const handleRemoveTask = (index) => {
    const newTasks = newTemplate.tasks.filter((_, i) => i !== index)
    setNewTemplate({ ...newTemplate, tasks: newTasks })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Project Templates</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create and manage project templates for faster project setup
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </button>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {editingTemplate ? 'Edit Template' : 'Create New Template'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Template Name
              </label>
              <input
                type="text"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter template name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={newTemplate.category}
                onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={newTemplate.description}
              onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter template description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Estimated Hours
              </label>
              <input
                type="number"
                value={newTemplate.estimatedHours}
                onChange={(e) => setNewTemplate({ ...newTemplate, estimatedHours: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="0"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublic"
                checked={newTemplate.isPublic}
                onChange={(e) => setNewTemplate({ ...newTemplate, isPublic: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isPublic" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Make template public
              </label>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tasks
            </label>
            <div className="space-y-2">
              {newTemplate.tasks.map((task, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={task}
                    onChange={(e) => handleTaskChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder={`Task ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveTask(index)}
                    className="p-2 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddTask}
                className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Task
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => {
                setShowAddForm(false)
                setEditingTemplate(null)
                setNewTemplate({ 
                  name: '', 
                  description: '', 
                  category: '',
                  tasks: [],
                  estimatedHours: '',
                  isPublic: false
                })
              }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={editingTemplate ? handleUpdateTemplate : handleAddTemplate}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {editingTemplate ? 'Update Template' : 'Create Template'}
            </button>
          </div>
        </motion.div>
      )}

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {template.name}
                </h3>
              </div>
              <div className="relative">
                <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              {template.description}
            </p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Category:</span>
                <span className="text-gray-900 dark:text-white">{template.category}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Estimated Hours:</span>
                <span className="text-gray-900 dark:text-white">{template.estimatedHours}h</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Tasks:</span>
                <span className="text-gray-900 dark:text-white">{template.tasks.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Usage:</span>
                <span className="text-gray-900 dark:text-white">{template.usageCount} times</span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                template.isPublic 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
              }`}>
                {template.isPublic ? 'Public' : 'Private'}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Created {template.createdAt}
              </span>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleUseTemplate(template)}
                className="flex-1 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center"
              >
                <Copy className="w-4 h-4 mr-1" />
                Use Template
              </button>
              <button
                onClick={() => handleEditTemplate(template)}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteTemplate(template.id)}
                className="px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No templates found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchQuery ? 'Try adjusting your search terms.' : 'Get started by creating your first template.'}
          </p>
        </div>
      )}
    </div>
  )
}

export default ProjectTemplates
