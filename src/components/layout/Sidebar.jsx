import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { 
  FolderOpen, 
  X,
  LogOut,
  Loader2
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const Sidebar = ({ isOpen, onClose }) => {
  const { adminUser, signOut } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const location = useLocation()

  const navigation = [
    { 
      name: 'Portfolio', 
      href: '/admin/portfolio', 
      icon: FolderOpen,
      badge: '12',
      submenu: [
        { name: 'All Portfolio', href: '/admin/portfolio' },
        { name: 'Add New', href: '/admin/portfolio/new' }
      ]
    }
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

  // Check if parent nav item should be active (only if exactly on that route, not sub-routes)
  const isParentActive = (href) => {
    return location.pathname === href || location.pathname === href + '/'
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
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
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => (
              <div key={item.name} className="space-y-1">
                <NavLink
                  to={item.href}
                  className={({ isActive }) => {
                    const active = isParentActive(item.href)
                    return `flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      active
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 hover:text-blue-700 dark:hover:text-blue-300 hover:shadow-sm'
                    }`
                  }}
                  onClick={onClose}
                >
                  <div className="flex items-center">
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </div>
                  {item.badge && (
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      isParentActive(item.href)
                        ? 'bg-white/20 text-white'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
                
                {/* Submenu */}
                {item.submenu && (
                  <div className="ml-8 mt-1 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 pl-3">
                    {item.submenu.map((subItem) => (
                      <NavLink
                        key={subItem.name}
                        to={subItem.href}
                        end={subItem.href === item.href} // Use end for exact match on "All Portfolio"
                        className={({ isActive }) =>
                          `block px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 relative ${
                            isActive
                              ? 'bg-blue-600 text-white shadow-md font-semibold'
                              : 'text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300'
                          }`
                        }
                        onClick={onClose}
                      >
                        {({ isActive }) => (
                          <>
                            {isActive && (
                              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-r-full"></span>
                            )}
                            <span className={isActive ? 'ml-1' : ''}>{subItem.name}</span>
                          </>
                        )}
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
              className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 dark:hover:from-red-900/20 dark:hover:to-red-900/30 rounded-lg transition-all duration-200 hover:text-red-600 dark:hover:text-red-400 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-700"
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
