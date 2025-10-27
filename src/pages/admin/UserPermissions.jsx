import { useState } from 'react'
import { 
  Search, 
  Shield,
  CheckCircle,
  XCircle,
  Settings,
  Users,
  FileText,
  BarChart3,
  Lock
} from 'lucide-react'
import { motion } from 'framer-motion'

const UserPermissions = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  // Mock data - replace with real data from your service
  const permissions = [
    {
      id: 'all',
      name: 'All Permissions',
      description: 'Full system access and control',
      category: 'System',
      icon: Shield,
      isSystem: true,
      roles: ['Super Admin']
    },
    {
      id: 'manage_users',
      name: 'Manage Users',
      description: 'Create, edit, delete, and manage user accounts',
      category: 'User Management',
      icon: Users,
      isSystem: false,
      roles: ['Super Admin', 'Admin']
    },
    {
      id: 'manage_roles',
      name: 'Manage Roles',
      description: 'Create, edit, and assign user roles',
      category: 'User Management',
      icon: Shield,
      isSystem: false,
      roles: ['Super Admin']
    },
    {
      id: 'manage_content',
      name: 'Manage Content',
      description: 'Create, edit, and publish content',
      category: 'Content',
      icon: FileText,
      isSystem: false,
      roles: ['Super Admin', 'Admin', 'Editor']
    },
    {
      id: 'manage_projects',
      name: 'Manage Projects',
      description: 'Create, edit, and manage projects',
      category: 'Projects',
      icon: Settings,
      isSystem: false,
      roles: ['Super Admin', 'Admin']
    },
    {
      id: 'view_analytics',
      name: 'View Analytics',
      description: 'Access to analytics and reporting data',
      category: 'Analytics',
      icon: BarChart3,
      isSystem: false,
      roles: ['Super Admin', 'Admin', 'Editor', 'Viewer']
    },
    {
      id: 'manage_settings',
      name: 'Manage Settings',
      description: 'Configure system settings and preferences',
      category: 'System',
      icon: Settings,
      isSystem: false,
      roles: ['Super Admin']
    },
    {
      id: 'view_users',
      name: 'View Users',
      description: 'View user information and profiles',
      category: 'User Management',
      icon: Users,
      isSystem: false,
      roles: ['Super Admin', 'Admin', 'Editor']
    }
  ]

  const categories = ['All', 'System', 'User Management', 'Content', 'Projects', 'Analytics']

  const filteredPermissions = permissions.filter(permission => {
    const matchesSearch = permission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         permission.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         permission.roles.some(role => role.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = categoryFilter === 'all' || permission.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const getCategoryColor = (category) => {
    switch (category) {
      case 'System':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'User Management':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'Content':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'Projects':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
      case 'Analytics':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Permissions</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View and manage system permissions and access controls
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search permissions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {categories.map(category => (
                <option key={category} value={category === 'All' ? 'all' : category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Permissions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPermissions.map((permission) => (
          <motion.div
            key={permission.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
                  <permission.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {permission.name}
                  </h3>
                  {permission.isSystem && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">System Permission</span>
                  )}
                </div>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              {permission.description}
            </p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Category:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(permission.category)}`}>
                  {permission.category}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Assigned to:</span>
                <span className="text-gray-900 dark:text-white">{permission.roles.length} roles</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Assigned Roles:
              </div>
              <div className="flex flex-wrap gap-1">
                {permission.roles.map(role => (
                  <span
                    key={role}
                    className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full dark:bg-gray-700 dark:text-gray-300"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                {permission.isSystem ? (
                  <>
                    <Lock className="w-4 h-4 mr-1" />
                    System Permission
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                    Custom Permission
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredPermissions.length === 0 && (
        <div className="text-center py-12">
          <Shield className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No permissions found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Try adjusting your search terms or filters.
          </p>
        </div>
      )}

      {/* Permission Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Permission Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Total Permissions</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{permissions.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
            <div className="flex items-center">
              <Lock className="w-8 h-8 text-red-600 dark:text-red-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">System Permissions</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {permissions.filter(p => p.isSystem).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Custom Permissions</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {permissions.filter(p => !p.isSystem).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Categories</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {categories.length - 1}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserPermissions
