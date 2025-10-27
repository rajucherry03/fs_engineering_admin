import { useState } from 'react'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Star,
  DollarSign,
  Clock,
  MoreVertical
} from 'lucide-react'
import { motion } from 'framer-motion'

const ContentServices = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  // Mock data - replace with real data from your service
  const services = [
    {
      id: '1',
      title: 'Web Development',
      description: 'Custom web applications and websites',
      category: 'Development',
      price: '$500 - $5000',
      duration: '2-8 weeks',
      rating: 4.8,
      status: 'active',
      featured: true,
      lastModified: '2024-01-15'
    },
    {
      id: '2',
      title: 'Mobile App Development',
      description: 'iOS and Android mobile applications',
      category: 'Development',
      price: '$1000 - $10000',
      duration: '4-12 weeks',
      rating: 4.9,
      status: 'active',
      featured: true,
      lastModified: '2024-01-14'
    },
    {
      id: '3',
      title: 'UI/UX Design',
      description: 'User interface and experience design',
      category: 'Design',
      price: '$300 - $2000',
      duration: '1-4 weeks',
      rating: 4.7,
      status: 'active',
      featured: false,
      lastModified: '2024-01-13'
    },
    {
      id: '4',
      title: 'Digital Marketing',
      description: 'SEO, social media, and online advertising',
      category: 'Marketing',
      price: '$200 - $1500',
      duration: 'Ongoing',
      rating: 4.6,
      status: 'inactive',
      featured: false,
      lastModified: '2024-01-12'
    }
  ]

  const categories = ['All', 'Development', 'Design', 'Marketing', 'Consulting']

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Services</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your service offerings and pricing
          </p>
        </div>
        <button className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Add Service
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
                placeholder="Search services..."
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

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {service.title}
                  </h3>
                  {service.featured && (
                    <Star className="w-4 h-4 text-yellow-500 ml-2" />
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {service.description}
                </p>
              </div>
              <div className="relative">
                <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Category:</span>
                <span className="text-gray-900 dark:text-white">{service.category}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Price:</span>
                <span className="text-gray-900 dark:text-white font-medium">{service.price}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Duration:</span>
                <span className="text-gray-900 dark:text-white">{service.duration}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Rating:</span>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="text-gray-900 dark:text-white">{service.rating}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Updated {service.lastModified}
              </span>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex items-center justify-center">
                <Eye className="w-4 h-4 mr-1" />
                View
              </button>
              <button className="flex-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center justify-center">
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </button>
              <button className="px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <Star className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No services found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Get started by adding your first service.
          </p>
        </div>
      )}
    </div>
  )
}

export default ContentServices
