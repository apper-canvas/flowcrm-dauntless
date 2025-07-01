import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Modal from '@/components/molecules/Modal'
import StatusBadge from '@/components/molecules/StatusBadge'
import TaskForm from '@/components/organisms/TaskForm'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { taskService } from '@/services/api/taskService'
import { contactService } from '@/services/api/contactService'
import { dealService } from '@/services/api/dealService'
import { format, isToday, isTomorrow, isPast } from 'date-fns'

const Tasks = () => {
  const [tasks, setTasks] = useState([])
  const [contacts, setContacts] = useState([])
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [filter, setFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const [tasksData, contactsData, dealsData] = await Promise.all([
        taskService.getAll(),
        contactService.getAll(),
        dealService.getAll()
      ])
      setTasks(tasksData)
      setContacts(contactsData)
      setDeals(dealsData)
    } catch (err) {
      setError('Failed to load tasks')
      console.error('Tasks load error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveTask = (savedTask) => {
    if (editingTask) {
      setTasks(prev => prev.map(t => t.Id === savedTask.Id ? savedTask : t))
    } else {
      setTasks(prev => [savedTask, ...prev])
    }
    
    setShowCreateModal(false)
    setEditingTask(null)
  }

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return

    try {
      await taskService.delete(taskId)
      setTasks(prev => prev.filter(t => t.Id !== taskId))
      toast.success('Task deleted successfully')
    } catch (error) {
      toast.error('Failed to delete task')
    }
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setShowCreateModal(true)
  }

  const handleToggleStatus = async (task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed'
    
    try {
      const updatedTask = await taskService.update(task.Id, { ...task, status: newStatus })
      setTasks(prev => prev.map(t => t.Id === updatedTask.Id ? updatedTask : t))
      toast.success(`Task marked as ${newStatus}`)
    } catch (error) {
      toast.error('Failed to update task status')
    }
  }

  const getContactName = (contactId) => {
    if (!contactId) return null
    const contact = contacts.find(c => c.Id === contactId)
    return contact ? contact.name : 'Unknown Contact'
  }

  const getDealTitle = (dealId) => {
    if (!dealId) return null
    const deal = deals.find(d => d.Id === dealId)
    return deal ? deal.title : 'Unknown Deal'
  }

  const getFilteredTasks = () => {
    let filtered = tasks

    // Status filter
    if (filter === 'today') {
      filtered = filtered.filter(task => task.dueDate && isToday(new Date(task.dueDate)))
    } else if (filter === 'upcoming') {
      filtered = filtered.filter(task => 
        task.dueDate && 
        new Date(task.dueDate) > new Date() && 
        !isToday(new Date(task.dueDate))
      )
    } else if (filter === 'overdue') {
      filtered = filtered.filter(task => 
        task.dueDate && 
        isPast(new Date(task.dueDate)) && 
        !isToday(new Date(task.dueDate)) &&
        task.status !== 'completed'
      )
    } else if (filter === 'completed') {
      filtered = filtered.filter(task => task.status === 'completed')
    } else if (filter === 'pending') {
      filtered = filtered.filter(task => task.status !== 'completed')
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter)
    }

    return filtered.sort((a, b) => {
      // Sort by due date, then by priority
      if (a.dueDate && b.dueDate) {
        const dateCompare = new Date(a.dueDate) - new Date(b.dueDate)
        if (dateCompare !== 0) return dateCompare
      }
      
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
  }

  const filteredTasks = getFilteredTasks()

  const filterOptions = [
    { value: 'all', label: 'All Tasks' },
    { value: 'today', label: 'Due Today' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' }
  ]

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ]

  const stats = {
    total: tasks.length,
    today: tasks.filter(task => task.dueDate && isToday(new Date(task.dueDate))).length,
    overdue: tasks.filter(task => 
      task.dueDate && 
      isPast(new Date(task.dueDate)) && 
      !isToday(new Date(task.dueDate)) &&
      task.status !== 'completed'
    ).length,
    completed: tasks.filter(task => task.status === 'completed').length
  }

  if (loading) return <Loading type="table" />
  if (error) return <Error message={error} onRetry={loadData} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Tasks
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your tasks and stay organized
          </p>
        </div>
        
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="mt-4 sm:mt-0"
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Task
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Total Tasks</p>
              <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckSquare" size={24} className="text-white" />
            </div>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-700">Due Today</p>
              <p className="text-3xl font-bold text-yellow-900">{stats.today}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="Calendar" size={24} className="text-white" />
            </div>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-700">Overdue</p>
              <p className="text-3xl font-bold text-red-900">{stats.overdue}</p>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="AlertTriangle" size={24} className="text-white" />
            </div>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Completed</p>
              <p className="text-3xl font-bold text-green-900">{stats.completed}</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckCircle" size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          {filterOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          {priorityOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 && !loading ? (
        <Empty
          type="tasks"
          onAction={() => setShowCreateModal(true)}
        />
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task, index) => (
            <motion.div
              key={task.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-6 bg-white rounded-xl card-shadow hover:shadow-lg transition-all duration-200 ${
                task.status === 'completed' ? 'opacity-75' : ''
              }`}
            >
              <div className="flex items-start space-x-4">
                <button
                  onClick={() => handleToggleStatus(task)}
                  className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                    task.status === 'completed'
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-300 hover:border-green-500'
                  }`}
                >
                  {task.status === 'completed' && (
                    <ApperIcon name="Check" size={12} className="text-white" />
                  )}
                </button>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`text-lg font-semibold ${
                        task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
                      }`}>
                        {task.title}
                      </h3>
                      
                      {task.description && (
                        <p className="text-gray-600 mt-1">{task.description}</p>
                      )}
                      
                      <div className="flex flex-wrap items-center gap-4 mt-3">
                        <div className="flex items-center space-x-2">
                          <ApperIcon name="Calendar" size={16} className="text-gray-400" />
                          <span className={`text-sm ${
                            task.dueDate && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate)) && task.status !== 'completed'
                              ? 'text-red-600 font-medium'
                              : isToday(new Date(task.dueDate))
                              ? 'text-yellow-600 font-medium'
                              : 'text-gray-600'
                          }`}>
                            {task.dueDate ? (
                              isToday(new Date(task.dueDate)) ? 'Due Today' :
                              isTomorrow(new Date(task.dueDate)) ? 'Due Tomorrow' :
                              isPast(new Date(task.dueDate)) && task.status !== 'completed' ? 'Overdue' :
                              format(new Date(task.dueDate), 'MMM d, yyyy')
                            ) : 'No due date'}
                          </span>
                        </div>
                        
                        <Badge 
                          variant={task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'success'}
                          size="sm"
                        >
                          {task.priority} priority
                        </Badge>
                        
                        <StatusBadge status={task.status} type="task" />
                        
                        {getContactName(task.contactId) && (
                          <div className="flex items-center space-x-1">
                            <ApperIcon name="User" size={14} className="text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {getContactName(task.contactId)}
                            </span>
                          </div>
                        )}
                        
                        {getDealTitle(task.dealId) && (
                          <div className="flex items-center space-x-1">
                            <ApperIcon name="TrendingUp" size={14} className="text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {getDealTitle(task.dealId)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditTask(task)}
                      >
                        <ApperIcon name="Edit" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTask(task.Id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <ApperIcon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false)
          setEditingTask(null)
        }}
        title={editingTask ? 'Edit Task' : 'Create New Task'}
        size="lg"
      >
        <TaskForm
          task={editingTask}
          onSave={handleSaveTask}
          onCancel={() => {
            setShowCreateModal(false)
            setEditingTask(null)
          }}
        />
      </Modal>
    </div>
  )
}

export default Tasks