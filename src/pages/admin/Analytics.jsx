import { useState } from 'react'
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Calendar,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'
import { motion } from 'framer-motion'

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30d')
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data - replace with real data from your analytics service
  const analyticsData = {
    overview: {
      totalViews: 12450,
      uniqueVisitors: 8920,
      pageViews: 18650,
      bounceRate: 32.5,
      avgSessionDuration: '2m 45s',
      newVisitors: 65.2
    },
    topPages: [
      { page: '/', views: 3240, growth: 12.5 },
      { page: '/about', views: 1890, growth: 8.3 },
      { page: '/services', views: 1560, growth: -2.1 },
      { page: '/contact', views: 980, growth: 15.7 },
      { page: '/portfolio', views: 720, growth: 22.1 }
    ],
    trafficSources: [
      { source: 'Direct', percentage: 45.2, visitors: 4030 },
      { source: 'Google', percentage: 32.8, visitors: 2920 },
      { source: 'Social Media', percentage: 15.6, visitors: 1390 },
      { source: 'Referrals', percentage: 6.4, visitors: 570 }
    ],
    deviceBreakdown: [
      { device: 'Desktop', percentage: 58.3, visitors: 5200 },
      { device: 'Mobile', percentage: 35.7, visitors: 3180 },
      { device: 'Tablet', percentage: 6.0, visitors: 540 }
    ]
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'traffic', name: 'Traffic', icon: TrendingUp },
    { id: 'content', name: 'Content', icon: Eye },
    { id: 'audience', name: 'Audience', icon: Users }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your website performance and user engagement
          </p>
        </div>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg flex items-center">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
          <button className="px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analyticsData.overview.totalViews.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">+12.5% from last month</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Unique Visitors</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analyticsData.overview.uniqueVisitors.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">+8.3% from last month</p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Bounce Rate</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analyticsData.overview.bounceRate}%
                  </p>
                  <p className="text-sm text-red-600 dark:text-red-400">+2.1% from last month</p>
                </div>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Session</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analyticsData.overview.avgSessionDuration}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">+15s from last month</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Pages */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Pages</h3>
              <div className="space-y-3">
                {analyticsData.topPages.map((page, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{page.page}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{page.views.toLocaleString()} views</p>
                    </div>
                    <span className={`text-sm font-medium ${
                      page.growth > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {page.growth > 0 ? '+' : ''}{page.growth}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Traffic Sources */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Traffic Sources</h3>
              <div className="space-y-3">
                {analyticsData.trafficSources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{source.source}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{source.visitors.toLocaleString()} visitors</p>
                    </div>
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full" 
                          style={{ width: `${source.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">
                        {source.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Other tabs would be implemented similarly */}
      {activeTab !== 'overview' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-12 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
          <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            {tabs.find(tab => tab.id === activeTab)?.name} Analytics
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            This section is coming soon with detailed analytics.
          </p>
        </div>
      )}
    </div>
  )
}

export default Analytics
