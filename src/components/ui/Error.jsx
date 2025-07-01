import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const Error = ({ 
  message = "Something went wrong. Please try again.", 
  onRetry,
  type = 'general'
}) => {
  const getErrorConfig = () => {
    switch (type) {
      case 'network':
        return {
          icon: 'WifiOff',
          title: 'Connection Error',
          description: 'Please check your internet connection and try again.'
        }
      case 'notfound':
        return {
          icon: 'Search',
          title: 'Not Found',
          description: 'The item you are looking for could not be found.'
        }
      default:
        return {
          icon: 'AlertTriangle',
          title: 'Error',
          description: message
        }
    }
  }

  const { icon, title, description } = getErrorConfig()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-6">
        <ApperIcon 
          name={icon} 
          size={32} 
          className="text-red-600" 
        />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 text-center mb-8 max-w-md">
        {description}
      </p>
      
      {onRetry && (
        <Button
          onClick={onRetry}
          className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white"
        >
          <ApperIcon name="RefreshCw" size={16} className="mr-2" />
          Try Again
        </Button>
      )}
    </motion.div>
  )
}

export default Error