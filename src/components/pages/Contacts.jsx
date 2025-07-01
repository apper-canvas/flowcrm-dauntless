import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import SearchBar from '@/components/molecules/SearchBar'
import Modal from '@/components/molecules/Modal'
import StatusBadge from '@/components/molecules/StatusBadge'
import ContactForm from '@/components/organisms/ContactForm'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { contactService } from '@/services/api/contactService'
import { format } from 'date-fns'

const Contacts = () => {
  const [contacts, setContacts] = useState([])
  const [filteredContacts, setFilteredContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingContact, setEditingContact] = useState(null)

  useEffect(() => {
    loadContacts()
  }, [])

  useEffect(() => {
    filterContacts()
  }, [contacts, searchQuery, statusFilter])

  const loadContacts = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await contactService.getAll()
      setContacts(data)
    } catch (err) {
      setError('Failed to load contacts')
      console.error('Contacts load error:', err)
    } finally {
      setLoading(false)
    }
  }

  const filterContacts = () => {
    let filtered = contacts

    if (searchQuery) {
      filtered = filtered.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.company?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(contact => contact.status === statusFilter)
    }

    setFilteredContacts(filtered)
  }

  const handleSaveContact = (savedContact) => {
    if (editingContact) {
      setContacts(prev => prev.map(c => c.Id === savedContact.Id ? savedContact : c))
    } else {
      setContacts(prev => [savedContact, ...prev])
    }
    
    setShowCreateModal(false)
    setEditingContact(null)
  }

  const handleDeleteContact = async (contactId) => {
    if (!confirm('Are you sure you want to delete this contact?')) return

    try {
      await contactService.delete(contactId)
      setContacts(prev => prev.filter(c => c.Id !== contactId))
      toast.success('Contact deleted successfully')
    } catch (error) {
      toast.error('Failed to delete contact')
    }
  }

  const handleEditContact = (contact) => {
    setEditingContact(contact)
    setShowCreateModal(true)
  }

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'lead', label: 'Lead' }
  ]

  if (loading) return <Loading type="table" />
  if (error) return <Error message={error} onRetry={loadContacts} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Contacts
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your customer relationships and contact information
          </p>
        </div>
        
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="mt-4 sm:mt-0"
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Contact
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex-1 max-w-lg">
          <SearchBar
            placeholder="Search contacts..."
            onSearch={setSearchQuery}
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Contacts List */}
      {filteredContacts.length === 0 && !loading ? (
        <Empty
          type="contacts"
          onAction={() => setShowCreateModal(true)}
        />
      ) : (
        <div className="bg-white rounded-xl card-shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContacts.map((contact, index) => (
                  <motion.tr
                    key={contact.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {contact.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {contact.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {contact.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {contact.company || 'No Company'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {contact.phone || 'No Phone'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={contact.status} type="contact" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(contact.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link to={`/contacts/${contact.Id}`}>
                          <Button variant="ghost" size="sm">
                            <ApperIcon name="Eye" size={16} />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditContact(contact)}
                        >
                          <ApperIcon name="Edit" size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteContact(contact.Id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <ApperIcon name="Trash2" size={16} />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false)
          setEditingContact(null)
        }}
        title={editingContact ? 'Edit Contact' : 'Create New Contact'}
        size="lg"
      >
        <ContactForm
          contact={editingContact}
          onSave={handleSaveContact}
          onCancel={() => {
            setShowCreateModal(false)
            setEditingContact(null)
          }}
        />
      </Modal>
    </div>
  )
}

export default Contacts