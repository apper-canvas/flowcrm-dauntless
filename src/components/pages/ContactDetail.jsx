import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Modal from '@/components/molecules/Modal'
import StatusBadge from '@/components/molecules/StatusBadge'
import ContactForm from '@/components/organisms/ContactForm'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { contactService } from '@/services/api/contactService'
import { dealService } from '@/services/api/dealService'
import { taskService } from '@/services/api/taskService'
import { activityService } from '@/services/api/activityService'
import { format } from 'date-fns'

const ContactDetail = () => {
  const { id } = useParams()
  const [contact, setContact] = useState(null)
  const [deals, setDeals] = useState([])
  const [tasks, setTasks] = useState([])
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [showEditModal, setShowEditModal] = useState(false)

  useEffect(() => {
    loadContactData()
  }, [id])

  const loadContactData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const [contactData, dealsData, tasksData, activitiesData] = await Promise.all([
        contactService.getById(parseInt(id)),
        dealService.getAll(),
        taskService.getAll(),
        activityService.getAll()
      ])
      
      setContact(contactData)
      setDeals(dealsData.filter(deal => deal.contactId === parseInt(id)))
      setTasks(tasksData.filter(task => task.contactId === parseInt(id)))
      setActivities(activitiesData.filter(activity => activity.contactId === parseInt(id)))
    } catch (err) {
      setError('Failed to load contact details')
      console.error('Contact detail load error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveContact = (savedContact) => {
    setContact(savedContact)
    setShowEditModal(false)
    toast.success('Contact updated successfully')
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'User' },
    { id: 'deals', label: 'Deals', icon: 'TrendingUp', count: deals.length },
    { id: 'tasks', label: 'Tasks', icon: 'CheckSquare', count: tasks.length },
    { id: 'activities', label: 'Activities', icon: 'Activity', count: activities.length }
  ]

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadContactData} />
  if (!contact) return <Error message="Contact not found" type="notfound" />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/contacts">
            <Button variant="ghost" size="sm">
              <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
              Back to Contacts
            </Button>
          </Link>
          
          <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">
              {contact.name.charAt(0).toUpperCase()}
            </span>
          </div>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{contact.name}</h1>
            <p className="text-gray-600">{contact.email}</p>
          </div>
        </div>
        
        <Button onClick={() => setShowEditModal(true)} className="mt-4 sm:mt-0">
          <ApperIcon name="Edit" size={16} className="mr-2" />
          Edit Contact
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } transition-colors duration-200`}
            >
              <ApperIcon name={tab.icon} size={16} className="mr-2" />
              {tab.label}
              {tab.count !== undefined && (
                <Badge variant="default" className="ml-2">
                  {tab.count}
                </Badge>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div className="bg-white rounded-xl card-shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Contact Information
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <ApperIcon name="Mail" size={16} className="text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">{contact.email}</p>
                  </div>
                </div>
                
                {contact.phone && (
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="Phone" size={16} className="text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Phone</p>
                      <p className="text-sm text-gray-600">{contact.phone}</p>
                    </div>
                  </div>
                )}
                
                {contact.company && (
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="Building" size={16} className="text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Company</p>
                      <p className="text-sm text-gray-600">{contact.company}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-3">
                  <ApperIcon name="Flag" size={16} className="text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Status</p>
                    <StatusBadge status={contact.status} type="contact" />
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <ApperIcon name="Calendar" size={16} className="text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Created</p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(contact.createdAt), 'MMMM d, yyyy')}
                    </p>
                  </div>
                </div>
                
                {contact.tags && contact.tags.length > 0 && (
                  <div className="flex items-start space-x-3">
                    <ApperIcon name="Tag" size={16} className="text-gray-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Tags</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {contact.tags.map(tag => (
                          <Badge key={tag} variant="secondary" size="sm">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl card-shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Stats
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="TrendingUp" size={20} className="text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">Deals</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900 mt-2">{deals.length}</p>
                </div>
                
                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="CheckSquare" size={20} className="text-green-600" />
                    <span className="text-sm font-medium text-green-700">Tasks</span>
                  </div>
                  <p className="text-2xl font-bold text-green-900 mt-2">{tasks.length}</p>
                </div>
                
                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Activity" size={20} className="text-purple-600" />
                    <span className="text-sm font-medium text-purple-700">Activities</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-900 mt-2">{activities.length}</p>
                </div>
                
                <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="DollarSign" size={20} className="text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-700">Deal Value</span>
                  </div>
                  <p className="text-2xl font-bold text-yellow-900 mt-2">
                    ${deals.reduce((sum, deal) => sum + (deal.value || 0), 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'deals' && (
          <div className="bg-white rounded-xl card-shadow">
            {deals.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Deal
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Value
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stage
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Expected Close
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {deals.map(deal => (
                      <tr key={deal.Id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {deal.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            ${deal.value?.toLocaleString() || 0}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={deal.stage} type="deal" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {deal.expectedClose ? format(new Date(deal.expectedClose), 'MMM d, yyyy') : 'Not set'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center">
                <ApperIcon name="TrendingUp" size={48} className="text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No deals yet</h3>
                <p className="text-gray-500">Start by creating a deal for this contact.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="bg-white rounded-xl card-shadow">
            {tasks.length > 0 ? (
              <div className="p-6 space-y-4">
                {tasks.map(task => (
                  <div key={task.Id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className={`w-3 h-3 rounded-full ${
                      task.priority === 'high' ? 'bg-red-500' :
                      task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{task.title}</p>
                      <p className="text-xs text-gray-500">
                        Due: {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : 'No due date'}
                      </p>
                    </div>
                    <StatusBadge status={task.status} type="task" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <ApperIcon name="CheckSquare" size={48} className="text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
                <p className="text-gray-500">Create tasks to track work related to this contact.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'activities' && (
          <div className="bg-white rounded-xl card-shadow">
            {activities.length > 0 ? (
              <div className="p-6 space-y-4">
                {activities.map(activity => (
                  <div key={activity.Id} className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mt-1">
                      <ApperIcon 
                        name={activity.type === 'call' ? 'Phone' : 
                              activity.type === 'email' ? 'Mail' :
                              activity.type === 'meeting' ? 'Calendar' : 'Activity'} 
                        size={16} 
                        className="text-primary-600" 
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(activity.timestamp), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <ApperIcon name="Activity" size={48} className="text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No activities yet</h3>
                <p className="text-gray-500">Activities will appear here as you interact with this contact.</p>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Contact"
        size="lg"
      >
        <ContactForm
          contact={contact}
          onSave={handleSaveContact}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>
    </div>
  )
}

export default ContactDetail