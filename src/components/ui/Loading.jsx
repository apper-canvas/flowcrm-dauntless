import { motion } from 'framer-motion'

const Loading = ({ type = 'default' }) => {
  if (type === 'table') {
    return (
      <div className="space-y-4">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center space-x-4 p-4 bg-white rounded-lg card-shadow"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full shimmer"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer w-3/4"></div>
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer w-1/2"></div>
            </div>
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer w-20"></div>
          </motion.div>
        ))}
      </div>
    )
  }

  if (type === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-white rounded-xl card-shadow space-y-4"
          >
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer w-3/4"></div>
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer w-1/2"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer"></div>
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer w-5/6"></div>
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  if (type === 'pipeline') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="space-y-4"
          >
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer"></div>
            {[...Array(3)].map((_, j) => (
              <div key={j} className="p-4 bg-white rounded-lg card-shadow space-y-3">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer w-3/4"></div>
                <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer w-1/2"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer"></div>
              </div>
            ))}
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-6 bg-white rounded-xl card-shadow space-y-4">
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer"></div>
            <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer"></div>
          </div>
        ))}
      </motion.div>
      
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 bg-white rounded-lg card-shadow space-y-3">
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer w-3/4"></div>
            <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Loading