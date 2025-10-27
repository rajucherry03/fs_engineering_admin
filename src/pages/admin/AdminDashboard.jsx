import { useProjectStats } from '../../hooks/useProjects'
import { useAuth } from '../../hooks/useAuth'
import { 
  Calendar,
  Briefcase, 
  User, 
  Mail,
  TrendingUp,
  Users,
  FileText,
  BarChart3,
  MapPin,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { motion } from 'framer-motion'

const AdminDashboard = () => {
  const { stats, loading } = useProjectStats()
  const { adminUser } = useAuth()

  const statsCards = [
    { 
      title: 'Interviews Schedule', 
      value: '86', 
      icon: Calendar, 
      color: 'bg-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-600 to-purple-700'
    },
    { 
      title: 'Application Sent', 
      value: '75', 
      icon: Briefcase, 
      color: 'bg-blue-500',
      bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600'
    },
    { 
      title: 'Profile Viewed', 
      value: '45,673', 
      icon: User, 
      color: 'bg-green-500',
      bgColor: 'bg-gradient-to-br from-green-500 to-green-600'
    },
    { 
      title: 'Unread Message', 
      value: '93', 
      icon: Mail, 
      color: 'bg-emerald-500',
      bgColor: 'bg-gradient-to-br from-emerald-500 to-emerald-600'
    },
  ]

  const recentActivities = [
    { action: 'Your application has accepted in 3 Vacancy', time: '12h ago', type: 'success' },
    { action: 'Your application has accepted in 3 Vacancy', time: '12h ago', type: 'success' },
    { action: 'Your application has accepted in 3 Vacancy', time: '12h ago', type: 'success' },
    { action: 'Your application has accepted in 3 Vacancy', time: '12h ago', type: 'success' },
  ]

  const recommendedJobs = [
    {
      company: 'Maximoz Team',
      title: 'Database Programmer',
      salary: '$14,000 - $25,000',
      location: 'London, England',
      type: 'REMOTE',
      logo: 'M',
      logoColor: 'bg-blue-500'
    },
    {
      company: 'Klean n Clin Studios',
      title: 'Senior Programmer',
      salary: '$14,000 - $25,000',
      location: 'Manchester, England',
      type: 'PART TIME',
      logo: 'K',
      logoColor: 'bg-orange-500'
    },
    {
      company: 'Maximoz Team',
      title: 'Intern UX Designer',
      salary: '$14,000 - $25,000',
      location: 'London, England',
      type: 'FULLTIME',
      logo: 'M',
      logoColor: 'bg-purple-500'
    }
  ]

  const featuredCompanies = [
    { name: 'Herman-Carter', logo: 'H', color: 'bg-blue-400', vacancies: 21 },
    { name: 'Funk Inc.', logo: 'F', color: 'bg-green-400', vacancies: 21 },
    { name: 'Williamson Inc', logo: 'W', color: 'bg-yellow-400', vacancies: 21 },
    { name: 'Donnelly Ltd.', logo: 'D', color: 'bg-pink-400', vacancies: 21 },
    { name: 'Herman-Cor', logo: 'H', color: 'bg-purple-400', vacancies: 21 }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="h-full">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <h2 className="text-xl font-semibold text-gray-700 mt-2">Project Management</h2>
          <p className="text-gray-600 mt-1">Manage and organize your projects</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 shadow-lg transition-colors">
          <span className="text-xl">+</span>
          <span>New Project</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="space-y-6">
        {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${card.bgColor} rounded-xl p-6 text-white shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">{card.title}</p>
                <p className="text-2xl font-bold">{card.value}</p>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <card.icon className="w-6 h-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - User Profile & Recent Activities */}
        <div className="lg:col-span-1 space-y-6">
          {/* User Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                <User className="w-8 h-8 text-white" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{adminUser?.name || 'Admin User'}</h3>
              <p className="text-sm text-gray-500">Programmer</p>
              
              {/* Skills Progress */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">PHP</span>
                  <span className="text-sm font-semibold text-orange-500">66%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '66%' }}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Vue</span>
                  <span className="text-sm font-semibold text-green-500">31%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '31%' }}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Laravel</span>
                  <span className="text-sm font-semibold text-green-600">7%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '7%' }}></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
              <button className="w-full text-center text-sm text-purple-600 hover:text-purple-700 flex items-center justify-center">
                <span>View More</span>
                <TrendingUp className="w-4 h-4 ml-1" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Vacancy Stats Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2 bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Vacancy Stats</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Application Sent</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Interviews</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Rejected</span>
              </div>
            </div>
            <select className="text-sm border border-gray-300 rounded-lg px-3 py-1">
              <option>This Month</option>
            </select>
          </div>
          
          {/* Simple Chart Representation */}
          <div className="h-64 flex items-end space-x-2">
            {[20, 35, 45, 30, 50, 40, 60, 45, 70, 55].map((height, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-purple-200 rounded-t" style={{ height: `${height}%` }}></div>
                <div className="w-full bg-green-200 rounded-t mt-1" style={{ height: `${height * 0.6}%` }}></div>
                <span className="text-xs text-gray-500 mt-2">W{String(index + 1).padStart(2, '0')}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recommended Jobs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-xl p-6 shadow-lg"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recommended Jobs</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedJobs.map((job, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-12 h-12 ${job.logoColor} rounded-lg flex items-center justify-center text-white font-bold`}>
                  {job.logo}
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  job.type === 'REMOTE' ? 'bg-purple-100 text-purple-800' :
                  job.type === 'PART TIME' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {job.type}
                </span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">{job.title}</h4>
              <p className="text-sm text-gray-600 mb-2">{job.company}</p>
              <p className="text-sm text-gray-500 mb-2">{job.salary}</p>
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="w-4 h-4 mr-1" />
                {job.location}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Featured Companies */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white rounded-xl p-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Featured Companies</h3>
          <button className="text-sm text-purple-600 hover:text-purple-700 flex items-center">
            View More
            <TrendingUp className="w-4 h-4 ml-1" />
          </button>
        </div>
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {featuredCompanies.map((company, index) => (
            <div key={index} className="flex-shrink-0 text-center">
              <div className={`w-16 h-16 ${company.color} rounded-lg flex items-center justify-center text-white font-bold text-lg mb-2`}>
                {company.logo}
              </div>
                <p className="text-sm font-medium text-gray-900">{company.name}</p>
                <p className="text-xs text-gray-500">{company.vacancies} Vacancy</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Additional Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Active Projects</span>
              <span className="text-lg font-semibold text-blue-600">24</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Completed Tasks</span>
              <span className="text-lg font-semibold text-green-600">156</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Pending Reviews</span>
              <span className="text-lg font-semibold text-orange-600">8</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Team Members</span>
              <span className="text-lg font-semibold text-purple-600">12</span>
            </div>
          </div>
        </motion.div>

        {/* Recent Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Notifications</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New project assigned</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Task completed successfully</p>
                <p className="text-xs text-gray-500">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Review pending</p>
                <p className="text-xs text-gray-500">6 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Team meeting scheduled</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* System Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="bg-white rounded-xl p-6 shadow-lg"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">Database</p>
              <p className="text-xs text-green-600">Operational</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">API Services</p>
              <p className="text-xs text-green-600">Operational</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">CDN</p>
              <p className="text-xs text-yellow-600">Maintenance</p>
            </div>
          </div>
        </div>
      </motion.div>
      </div>
    </div>
  )
}

export default AdminDashboard
