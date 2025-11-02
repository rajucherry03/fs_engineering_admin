import { useState } from 'react'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Star,
  User,
  Quote,
  Calendar,
  MoreVertical
} from 'lucide-react'
import { motion } from 'framer-motion'
import ImageWithFallback from '../../components/ui/ImageWithFallback'
import ImageUpload from '../../components/ui/ImageUpload'

const ContentTestimonials = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [ratingFilter, setRatingFilter] = useState('all')

  // Mock data - replace with real data from your service
  const testimonials = [
    {
      id: '1',
      name: 'Sarah Johnson',
      company: 'TechCorp Inc.',
      position: 'CEO',
      content: 'Outstanding service! The team delivered exactly what we needed on time and within budget.',
      rating: 5,
      status: 'published',
      featured: true,
      createdAt: '2024-01-15',
      avatar: null
    },
    {
      id: '2',
      name: 'Michael Chen',
      company: 'StartupXYZ',
      position: 'Founder',
      content: 'Professional, reliable, and innovative. Highly recommend their services.',
      rating: 5,
      status: 'published',
      featured: true,
      createdAt: '2024-01-14',
      avatar: null
    },
    {
      id: '3',
      name: 'Emily Davis',
      company: 'Design Studio',
      position: 'Creative Director',
      content: 'Great collaboration and excellent results. Will definitely work with them again.',
      rating: 4,
      status: 'published',
      featured: false,
      createdAt: '2024-01-13',
      avatar: null
    },
    {
      id: '4',
      name: 'David Wilson',
      company: 'Marketing Pro',
      position: 'Marketing Manager',
      content: 'Exceeded our expectations. The quality of work is exceptional.',
      rating: 5,
      status: 'pending',
      featured: false,
      createdAt: '2024-01-12',
      avatar: null
    }
  ]

  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesSearch = testimonial.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         testimonial.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         testimonial.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRating = ratingFilter === 'all' || testimonial.rating.toString() === ratingFilter
    return matchesSearch && matchesRating
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Testimonials</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage customer testimonials and reviews
          </p>
        </div>
        <button className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Add Testimonial
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
                placeholder="Search testimonials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTestimonials.map((testimonial) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="mr-3">
                  <ImageWithFallback
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900"
                    fallbackText={testimonial.name ? testimonial.name.charAt(0).toUpperCase() : '👤'}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.position} at {testimonial.company}
                  </p>
                </div>
              </div>
              <div className="relative">
                <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center mb-2">
                <div className="flex">
                  {renderStars(testimonial.rating)}
                </div>
                {testimonial.featured && (
                  <Star className="w-4 h-4 text-yellow-500 ml-2" />
                )}
              </div>
              <div className="relative">
                <Quote className="absolute -top-2 -left-2 w-6 h-6 text-gray-300 dark:text-gray-600" />
                <p className="text-gray-700 dark:text-gray-300 italic pl-4">
                  "{testimonial.content}"
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(testimonial.status)}`}>
                {testimonial.status.charAt(0).toUpperCase() + testimonial.status.slice(1)}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {testimonial.createdAt}
              </span>
            </div>

            <div className="flex space-x-2">
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

      {filteredTestimonials.length === 0 && (
        <div className="text-center py-12">
          <Quote className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No testimonials found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Get started by adding your first testimonial.
          </p>
        </div>
      )}
    </div>
  )
}

export default ContentTestimonials
