import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { contactService } from '@/services/api/contactService'
import { dealService } from '@/services/api/dealService'
import { taskService } from '@/services/api/taskService'
import { activityService } from '@/services/api/activityService'
import { format, isToday, isTomorrow } from 'date-fns'

const Dashboard = () => {
  const [data, setData] = useState({
    contacts: [],
    deals: [],
    tasks: [],
    activities: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const [contacts, deals, tasks, activities] = await Promise.all([
        contactService.getAll(),
        dealService.getAll(),
        taskService.getAll(),
        activityService.getAll()
      ])
      
      setData({ contacts, deals, tasks, activities })
    } catch (err) {
      setError('Failed to load dashboard data')
      console.error('Dashboard load error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadDashboardData} />

  const metrics = {
    totalContacts: data.contacts.length,
    activeDeals: data.deals.filter(deal => !['closed_won', 'closed_lost'].includes(deal.stage)).length,
    totalDealsValue: data.deals.reduce((sum, deal) => sum + (deal.value || 0), 0),
    pendingTasks: data.tasks.filter(task => task.status === 'pending').length,
    todayTasks: data.tasks.filter(task => task.dueDate && isToday(new Date(task.dueDate))).length,
    overdueTasks: data.tasks.filter(task => 
      task.dueDate && 
      new Date(task.dueDate) < new Date() && 
      task.status !== 'completed'
    ).length
  }

  const recentActivities = data.activities
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5)

  const upcomingTasks = data.tasks
    .filter(task => task.status !== 'completed')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5)

  const pipelineData = [
    { stage: 'Lead', deals: data.deals.filter(d => d.stage === 'lead'), color: 'bg-blue-500' },
    { stage: 'Qualified', deals: data.deals.filter(d => d.stage === 'qualified'), color: 'bg-indigo-500' },
    { stage: 'Proposal', deals: data.deals.filter(d => d.stage === 'proposal'), color: 'bg-yellow-500' },
    { stage: 'Negotiation', deals: data.deals.filter(d => d.stage === 'negotiation'), color: 'bg-purple-500' },
    { stage: 'Closed Won', deals: data.deals.filter(d => d.stage === 'closed_won'), color: 'bg-green-500' }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Sales Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Monitor your sales pipeline and customer relationships
          </p>
        </div>
        
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <Link to="/contacts">
            <Button variant="secondary">
              <ApperIcon name="Users" size={16} className="mr-2" />
              View Contacts
            </Button>
          </Link>
          <Link to="/deals">
            <Button>
              <ApperIcon name="TrendingUp" size={16} className="mr-2" />
              View Pipeline
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 card-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Total Contacts</p>
              <p className="text-3xl font-bold text-blue-900">{metrics.totalContacts}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="Users" size={24} className="text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 card-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Active Deals</p>
              <p className="text-3xl font-bold text-green-900">{metrics.activeDeals}</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingUp" size={24} className="text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200 card-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-700">Pipeline Value</p>
              <p className="text-3xl font-bold text-yellow-900">
                ${metrics.totalDealsValue.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="DollarSign" size={24} className="text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 card-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Pending Tasks</p>
              <p className="text-3xl font-bold text-purple-900">{metrics.pendingTasks}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckSquare" size={24} className="text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Pipeline Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl card-shadow p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Sales Pipeline</h2>
          <Link to="/deals">
            <Button variant="secondary" size="sm">
              View All Deals
              <ApperIcon name="ArrowRight" size={16} className="ml-2" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {pipelineData.map((stage, index) => (
            <motion.div
              key={stage.stage}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                <h3 className="font-medium text-gray-900">{stage.stage}</h3>
                <Badge variant="default">{stage.deals.length}</Badge>
              </div>
              
              <div className="space-y-2">
                {stage.deals.slice(0, 3).map(deal => (
                  <div key={deal.Id} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {deal.title}
                    </p>
                    <p className="text-xs text-gray-600">
                      ${deal.value?.toLocaleString() || 0}
                    </p>
                  </div>
                ))}
                {stage.deals.length > 3 && (
                  <p className="text-xs text-gray-500 text-center py-2">
                    +{stage.deals.length - 3} more
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Tasks and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl card-shadow p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Tasks</h2>
            <Link to="/tasks">
              <Button variant="secondary" size="sm">
                View All
                <ApperIcon name="ArrowRight" size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="space-y-4">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map(task => (
                <div key={task.Id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${
                    task.priority === 'high' ? 'bg-red-500' :
                    task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {task.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {task.dueDate && (
                        isToday(new Date(task.dueDate)) ? 'Today' :
                        isTomorrow(new Date(task.dueDate)) ? 'Tomorrow' :
                        format(new Date(task.dueDate), 'MMM d')
                      )}
                    </p>
                  </div>
                  <Badge 
                    variant={task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'success'}
                    size="sm"
                  >
                    {task.priority}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No upcoming tasks</p>
            )}
          </div>
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl card-shadow p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activities</h2>
            <Link to="/activities">
              <Button variant="secondary" size="sm">
                View All
                <ApperIcon name="ArrowRight" size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map(activity => (
                <div key={activity.Id} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mt-1">
                    <ApperIcon 
                      name={activity.type === 'call' ? 'Phone' : 
                            activity.type === 'email' ? 'Mail' :
                            activity.type === 'meeting' ? 'Calendar' : 'Activity'} 
                      size={16} 
                      className="text-primary-600" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(activity.timestamp), 'MMM d, h:mm a')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No recent activities</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard