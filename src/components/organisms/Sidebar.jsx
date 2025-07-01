import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const Sidebar = ({ onClose }) => {
  const navigation = [
    { name: 'Dashboard', href: '/', icon: 'BarChart3' },
    { name: 'Contacts', href: '/contacts', icon: 'Users' },
    { name: 'Deals', href: '/deals', icon: 'TrendingUp' },
    { name: 'Tasks', href: '/tasks', icon: 'CheckSquare' },
    { name: 'Activities', href: '/activities', icon: 'Activity' },
  ]

  return (
    <div className="flex flex-col h-full bg-white shadow-xl">
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
            <ApperIcon name="Zap" size={20} className="text-primary-600" />
          </div>
          <h1 className="text-xl font-bold text-white">FlowCRM</h1>
        </div>
        
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="lg:hidden text-white hover:bg-white/20"
          >
            <ApperIcon name="X" size={20} />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <NavLink
              to={item.href}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
              onClick={onClose}
            >
              {({ isActive }) => (
                <>
                  <ApperIcon 
                    name={item.icon} 
                    size={20} 
                    className={`mr-3 ${isActive ? 'text-white' : 'text-gray-500'}`} 
                  />
                  {item.name}
                </>
              )}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
          <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mr-3">
            <ApperIcon name="User" size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Sales Team</p>
            <p className="text-xs text-gray-500">CRM User</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar