import { useState } from 'react'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Shield,
  Users,
  Settings,
  MoreVertical
} from 'lucide-react'
import { motion } from 'framer-motion'

const UserRoles = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingRole, setEditingRole] = useState(null)
  const [newRole, setNewRole] = useState({ 
    name: '', 
    description: '', 
    permissions: [],
    color: '#3B82F6'
  })

  // Mock data - replace with real data from your service
  const roles = [
    {
      id: '1',
      name: 'Super Admin',
      description: 'Full system access and control',
      permissions: ['all'],
      color: '#EF4444',
      userCount: 2,
      createdAt: '2024-01-01',
      isSystem: true
    },
    {
      id: '2',
      name: 'Admin',
      description: 'Administrative access with limited system control',
      permissions: ['manage_users', 'manage_content', 'view_analytics'],
      color: '#3B82F6',
      userCount: 5,
      createdAt: '2024-01-02',
      isSystem: false
    },
    {
      id: '3',
      name: 'Editor',
      description: 'Content creation and editing permissions',
      permissions: ['manage_content', 'view_analytics'],
      color: '#10B981',
      userCount: 8,
      createdAt: '2024-01-03',
      isSystem: false
    },
    {
      id: '4',
      name: 'Viewer',
      description: 'Read-only access to system data',
      permissions: ['view_analytics'],
      color: '#6B7280',
      userCount: 12,
      createdAt: '2024-01-04',
      isSystem: false
    }
  ]

  const availablePermissions = [
    { id: 'all', name: 'All Permissions', description: 'Full system access' },
    { id: 'manage_users', name: 'Manage Users', description: 'Create, edit, and delete users' },
    { id: 'manage_content', name: 'Manage Content', description: 'Create and edit content' },
    { id: 'manage_projects', name: 'Manage Projects', description: 'Create and manage projects' },
    { id: 'view_analytics', name: 'View Analytics', description: 'Access to analytics and reports' },
    { id: 'manage_settings', name: 'Manage Settings', description: 'System configuration access' },
    { id: 'manage_roles', name: 'Manage Roles', description: 'Create and assign user roles' }
  ]

  const colorOptions = [
    '#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6B7280'
  ]

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddRole = () => {
    // Add role logic here
    console.log('Adding role:', newRole)
    setNewRole({ name: '', description: '', permissions: [], color: '#3B82F6' })
    setShowAddForm(false)
  }

  const handleEditRole = (role) => {
    setEditingRole(role)
    setNewRole({
      name: role.name,
      description: role.description,
      permissions: role.permissions,
      color: role.color
    })
    setShowAddForm(true)
  }

  const handleUpdateRole = () => {
    // Update role logic here
    console.log('Updating role:', editingRole.id, newRole)
    setEditingRole(null)
    setNewRole({ name: '', description: '', permissions: [], color: '#3B82F6' })
    setShowAddForm(false)
  }

  const handleDeleteRole = (roleId) => {
    // Delete role logic here
    console.log('Deleting role:', roleId)
  }

  const handlePermissionToggle = (permissionId) => {
    if (permissionId === 'all') {
      setNewRole({ ...newRole, permissions: ['all'] })
    } else {
      const newPermissions = newRole.permissions.includes(permissionId)
        ? newRole.permissions.filter(p => p !== permissionId)
        : [...newRole.permissions.filter(p => p !== 'all'), permissionId]
      setNewRole({ ...newRole, permissions: newPermissions })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Roles</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Define and manage user roles and permissions
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Role
        </button>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search roles..."
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
            {editingRole ? 'Edit Role' : 'Add New Role'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Role Name
              </label>
              <input
                type="text"
                value={newRole.name}
                onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter role name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Color
              </label>
              <div className="flex space-x-2">
                {colorOptions.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setNewRole({ ...newRole, color })}
                    className={`w-8 h-8 rounded-full border-2 ${
                      newRole.color === color ? 'border-gray-900 dark:border-white' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={newRole.description}
              onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter role description"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Permissions
            </label>
            <div className="space-y-2">
              {availablePermissions.map(permission => (
                <div key={permission.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={permission.id}
                    checked={newRole.permissions.includes(permission.id)}
                    onChange={() => handlePermissionToggle(permission.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={permission.id} className="ml-3">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {permission.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {permission.description}
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => {
                setShowAddForm(false)
                setEditingRole(null)
                setNewRole({ name: '', description: '', permissions: [], color: '#3B82F6' })
              }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={editingRole ? handleUpdateRole : handleAddRole}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {editingRole ? 'Update Role' : 'Add Role'}
            </button>
          </div>
        </motion.div>
      )}

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoles.map((role) => (
          <motion.div
            key={role.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div
                  className="w-4 h-4 rounded-full mr-3"
                  style={{ backgroundColor: role.color }}
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {role.name}
                  </h3>
                  {role.isSystem && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">System Role</span>
                  )}
                </div>
              </div>
              <div className="relative">
                <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              {role.description}
            </p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Users:</span>
                <span className="text-gray-900 dark:text-white">{role.userCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Permissions:</span>
                <span className="text-gray-900 dark:text-white">
                  {role.permissions.includes('all') ? 'All' : role.permissions.length}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Permissions:
              </div>
              <div className="flex flex-wrap gap-1">
                {role.permissions.includes('all') ? (
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full dark:bg-red-900 dark:text-red-300">
                    All Permissions
                  </span>
                ) : (
                  role.permissions.slice(0, 3).map(permission => (
                    <span
                      key={permission}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full dark:bg-blue-900 dark:text-blue-300"
                    >
                      {permission.replace('_', ' ')}
                    </span>
                  ))
                )}
                {role.permissions.length > 3 && !role.permissions.includes('all') && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full dark:bg-gray-700 dark:text-gray-300">
                    +{role.permissions.length - 3} more
                  </span>
                )}
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleEditRole(role)}
                disabled={role.isSystem}
                className="flex-1 px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </button>
              <button
                onClick={() => handleDeleteRole(role.id)}
                disabled={role.isSystem}
                className="px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredRoles.length === 0 && (
        <div className="text-center py-12">
          <Shield className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No roles found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Get started by creating your first role.
          </p>
        </div>
      )}
    </div>
  )
}

export default UserRoles
