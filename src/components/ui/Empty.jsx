import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const Empty = ({ 
  title = "No data found",
  description = "Get started by creating your first item.",
  actionLabel = "Create New",
  onAction,
  icon = "Plus",
  type = 'default'
}) => {
  const getEmptyConfig = () => {
    switch (type) {
      case 'contacts':
        return {
          icon: 'Users',
          title: 'No contacts yet',
          description: 'Start building your customer relationships by adding your first contact.',
          actionLabel: 'Add Contact'
        }
      case 'deals':
        return {
          icon: 'TrendingUp',
          title: 'No deals in progress',
          description: 'Create your first deal and start tracking your sales pipeline.',
          actionLabel: 'Create Deal'
        }
      case 'tasks':
        return {
          icon: 'CheckSquare',
          title: 'All caught up!',
          description: 'No tasks to show. Create a new task to stay organized.',
          actionLabel: 'Add Task'
        }
      case 'activities':
        return {
          icon: 'Activity',
          title: 'No activities logged',
          description: 'Start tracking your customer interactions and activities.',
          actionLabel: 'Log Activity'
        }
      default:
        return { icon, title, description, actionLabel }
    }
  }

  const config = getEmptyConfig()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mb-6">
        <ApperIcon 
          name={config.icon} 
          size={36} 
          className="text-primary-600" 
        />
      </div>
      
      <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
        {config.title}
      </h3>
      
      <p className="text-gray-600 text-center mb-8 max-w-md">
        {config.description}
      </p>
      
      {onAction && (
        <Button
          onClick={onAction}
          className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white px-6 py-3 text-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          <ApperIcon name="Plus" size={20} className="mr-2" />
          {config.actionLabel}
        </Button>
      )}
    </motion.div>
  )
}

export default Empty