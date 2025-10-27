import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  FolderOpen, 
  Users, 
  FileText, 
  BarChart3, 
  Settings,
  X,
  LogOut,
  Loader2
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const Sidebar = ({ isOpen, onClose }) => {
  const { adminUser, signOut } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/admin', 
      icon: LayoutDashboard,
      badge: null
    },
    { 
      name: 'Projects', 
      href: '/admin/projects', 
      icon: FolderOpen,
      badge: '12',
      submenu: [
        { name: 'All Projects', href: '/admin/projects' },
        { name: 'Add New', href: '/admin/projects/new' },
        { name: 'Categories', href: '/admin/projects/categories' },
        { name: 'Templates', href: '/admin/projects/templates' }
      ]
    },
    { 
      name: 'Content', 
      href: '/admin/content', 
      icon: FileText,
      badge: null,
      submenu: [
        { name: 'Pages', href: '/admin/content/pages' },
        { name: 'Services', href: '/admin/content/services' },
        { name: 'Testimonials', href: '/admin/content/testimonials' },
        { name: 'Blog', href: '/admin/content/blog' }
      ]
    },
    { 
      name: 'Users', 
      href: '/admin/users', 
      icon: Users,
      badge: '3',
      submenu: [
        { name: 'All Users', href: '/admin/users' },
        { name: 'Roles', href: '/admin/users/roles' },
        { name: 'Permissions', href: '/admin/users/permissions' }
      ]
    },
    { 
      name: 'Analytics', 
      href: '/admin/analytics', 
      icon: BarChart3,
      badge: null
    },
    { 
      name: 'Settings', 
      href: '/admin/settings', 
      icon: Settings,
      badge: null
    },
  ]

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true)
      await signOut()
    } catch (error) {
      console.error('Sign out error:', error)
      // You could add a toast notification here for better UX
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-2xl border-r border-gray-200 dark:border-gray-700
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0 lg:shadow-none
      `}>
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Admin Portal
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {adminUser?.role?.replace('_', ' ').toUpperCase()}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <div key={item.name}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 dark:from-blue-900/30 dark:to-purple-900/30 dark:text-blue-300 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50 hover:shadow-sm'
                    }`
                  }
                  onClick={onClose}
                >
                  <div className="flex items-center">
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </div>
                  {item.badge && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full dark:bg-blue-900 dark:text-blue-300">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
                
                {/* Submenu */}
                {item.submenu && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.submenu.map((subItem) => (
                      <NavLink
                        key={subItem.name}
                        to={subItem.href}
                        className={({ isActive }) =>
                          `block px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                            isActive
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                              : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50'
                          }`
                        }
                        onClick={onClose}
                      >
                        {subItem.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* User info and sign out */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 dark:from-gray-500 dark:to-gray-700 rounded-full flex items-center justify-center shadow-md">
                <span className="text-sm font-semibold text-white">
                  {adminUser?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {adminUser?.name || adminUser?.email}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {adminUser?.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              disabled={isLoggingOut}
              className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-red-50 dark:text-gray-300 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? (
                <Loader2 className="w-4 h-4 mr-3 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4 mr-3" />
              )}
              {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
