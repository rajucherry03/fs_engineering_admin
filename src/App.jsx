import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth.jsx'
import LoginPage from './pages/auth/LoginPage.jsx'
import AdminLayout from './components/layout/AdminLayout.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import ProjectManagement from './pages/admin/ProjectManagement.jsx'
import ProjectNew from './pages/admin/ProjectNew.jsx'
import ProjectCategories from './pages/admin/ProjectCategories.jsx'
import ProjectTemplates from './pages/admin/ProjectTemplates.jsx'
import UserManagement from './pages/admin/UserManagement.jsx'
import UserRoles from './pages/admin/UserRoles.jsx'
import UserPermissions from './pages/admin/UserPermissions.jsx'
import ContentManagement from './pages/admin/ContentManagement.jsx'
import ContentPages from './pages/admin/ContentPages.jsx'
import ContentServices from './pages/admin/ContentServices.jsx'
import ContentTestimonials from './pages/admin/ContentTestimonials.jsx'
import ContentBlog from './pages/admin/ContentBlog.jsx'
import Analytics from './pages/admin/Analytics.jsx'
import Settings from './pages/admin/Settings.jsx'
import LoadingSpinner from './components/ui/LoadingSpinner.jsx'

function ProtectedRoute({ children }) {
  const { user, adminUser, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user || !adminUser) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function AppRoutes() {
  const { user, adminUser, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={user && adminUser ? <Navigate to="/admin" replace /> : <LoginPage />} 
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="projects" element={<ProjectManagement />} />
        <Route path="projects/new" element={<ProjectNew />} />
        <Route path="projects/categories" element={<ProjectCategories />} />
        <Route path="projects/templates" element={<ProjectTemplates />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="users/roles" element={<UserRoles />} />
        <Route path="users/permissions" element={<UserPermissions />} />
        <Route path="content" element={<ContentManagement />} />
        <Route path="content/pages" element={<ContentPages />} />
        <Route path="content/services" element={<ContentServices />} />
        <Route path="content/testimonials" element={<ContentTestimonials />} />
        <Route path="content/blog" element={<ContentBlog />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
