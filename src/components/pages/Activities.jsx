import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { activityService } from '@/services/api/activityService'
import { contactService } from '@/services/api/contactService'
import { format, isToday, isYesterday, subDays } from 'date-fns'

const Activities = () => {
  const [activities, setActivities] = useState([])
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [typeFilter, setTypeFilter] = useState('all')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const [activitiesData, contactsData] = await Promise.all([
        activityService.getAll(),
        contactService.getAll()
      ])
      setActivities(activitiesData)
      setContacts(contactsData)
    } catch (err) {
      setError('Failed to load activities')
      console.error('Activities load error:', err)
    } finally {
      setLoading(false)
    }
  }

  const getContactName = (contactId) => {
    if (!contactId) return 'System'
    const contact = contacts.find(c => c.Id === contactId)
    return contact ? contact.name : 'Unknown Contact'
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'call':
        return 'Phone'
      case 'email':
        return 'Mail'
      case 'meeting':
        return 'Calendar'
      case 'note':
        return 'FileText'
      case 'task':
        return 'CheckSquare'
      case 'deal':
        return 'TrendingUp'
      default:
        return 'Activity'
    }
  }

  const getActivityColor = (type) => {
    switch (type) {
      case 'call':
        return 'bg-blue-100 text-blue-600'
      case 'email':
        return 'bg-green-100 text-green-600'
      case 'meeting':
        return 'bg-purple-100 text-purple-600'
      case 'note':
        return 'bg-yellow-100 text-yellow-600'
      case 'task':
        return 'bg-indigo-100 text-indigo-600'
      case 'deal':
        return 'bg-orange-100 text-orange-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const formatActivityDate = (timestamp) => {
    const date = new Date(timestamp)
    
    if (isToday(date)) {
      return `Today at ${format(date, 'h:mm a')}`
    } else if (isYesterday(date)) {
      return `Yesterday at ${format(date, 'h:mm a')}`
    } else if (date >= subDays(new Date(), 7)) {
      return format(date, 'EEEE \'at\' h:mm a')
    } else {
      return format(date, 'MMM d, yyyy \'at\' h:mm a')
    }
  }

  const getFilteredActivities = () => {
    let filtered = activities

    if (typeFilter !== 'all') {
      filtered = filtered.filter(activity => activity.type === typeFilter)
    }

    return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }

  const filteredActivities = getFilteredActivities()

  const typeOptions = [
    { value: 'all', label: 'All Activities' },
    { value: 'call', label: 'Calls' },
    { value: 'email', label: 'Emails' },
    { value: 'meeting', label: 'Meetings' },
    { value: 'note', label: 'Notes' },
    { value: 'task', label: 'Tasks' },
    { value: 'deal', label: 'Deals' }
  ]

  const activityTypes = [...new Set(activities.map(a => a.type))]
  const stats = {
    total: activities.length,
    today: activities.filter(a => isToday(new Date(a.timestamp))).length,
    thisWeek: activities.filter(a => new Date(a.timestamp) >= subDays(new Date(), 7)).length,
    byType: activityTypes.reduce((acc, type) => {
      acc[type] = activities.filter(a => a.type === type).length
      return acc
    }, {})
  }

  // Group activities by date
  const groupedActivities = filteredActivities.reduce((groups, activity) => {
    const date = format(new Date(activity.timestamp), 'yyyy-MM-dd')
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(activity)
    return groups
  }, {})

  if (loading) return <Loading type="table" />
  if (error) return <Error message={error} onRetry={loadData} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Activities
          </h1>
          <p className="text-gray-600 mt-1">
            Track all customer interactions and activities
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Total Activities</p>
              <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="Activity" size={24} className="text-white" />
            </div>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Today</p>
              <p className="text-3xl font-bold text-green-900">{stats.today}</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="Calendar" size={24} className="text-white" />
            </div>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">This Week</p>
              <p className="text-3xl font-bold text-purple-900">{stats.thisWeek}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingUp" size={24} className="text-white" />
            </div>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-700">Most Active</p>
              <p className="text-xl font-bold text-yellow-900">
                {Object.keys(stats.byType).length > 0 
                  ? Object.keys(stats.byType).reduce((a, b) => stats.byType[a] > stats.byType[b] ? a : b)
                  : 'None'
                }
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="Star" size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center space-x-4">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          {typeOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Activities Timeline */}
      {filteredActivities.length === 0 && !loading ? (
        <Empty
          type="activities"
          onAction={() => console.log('Log activity')}
        />
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedActivities).map(([date, dayActivities]) => (
            <motion.div
              key={date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {isToday(new Date(date)) ? 'Today' :
                   isYesterday(new Date(date)) ? 'Yesterday' :
                   format(new Date(date), 'EEEE, MMMM d, yyyy')}
                </h2>
                <div className="flex-1 h-px bg-gray-200"></div>
                <Badge variant="default">{dayActivities.length} activities</Badge>
              </div>

              <div className="space-y-3">
                {dayActivities.map((activity, index) => (
                  <motion.div
                    key={activity.Id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start space-x-4 p-4 bg-white rounded-lg card-shadow hover:shadow-md transition-all duration-200"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                      <ApperIcon 
                        name={getActivityIcon(activity.type)} 
                        size={20} 
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            {activity.description}
                          </p>
                          
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>{formatActivityDate(activity.timestamp)}</span>
                            
                            <div className="flex items-center space-x-1">
                              <ApperIcon name="User" size={12} />
                              <span>{getContactName(activity.contactId)}</span>
                            </div>
                            
                            <Badge 
                              variant="secondary" 
                              size="sm"
                              className="capitalize"
                            >
                              {activity.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                          {Object.entries(activity.metadata).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="font-medium">{key}:</span>
                              <span>{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Activities