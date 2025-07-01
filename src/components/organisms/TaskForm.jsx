import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import ApperIcon from '@/components/ApperIcon'
import { taskService } from '@/services/api/taskService'
import { contactService } from '@/services/api/contactService'
import { dealService } from '@/services/api/dealService'

const TaskForm = ({ task, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    dueDate: task?.dueDate || '',
    priority: task?.priority || 'medium',
    status: task?.status || 'pending',
    contactId: task?.contactId || '',
    dealId: task?.dealId || ''
  })
  
  const [loading, setLoading] = useState(false)
  const [contacts, setContacts] = useState([])
  const [deals, setDeals] = useState([])

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ]

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' }
  ]

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [contactsData, dealsData] = await Promise.all([
        contactService.getAll(),
        dealService.getAll()
      ])
      setContacts(contactsData)
      setDeals(dealsData)
    } catch (error) {
      console.error('Failed to load data:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let savedTask
      if (task?.Id) {
        savedTask = await taskService.update(task.Id, formData)
        toast.success('Task updated successfully!')
      } else {
        savedTask = await taskService.create(formData)
        toast.success('Task created successfully!')
      }

      if (onSave) {
        onSave(savedTask)
      }
    } catch (error) {
      toast.error('Failed to save task. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const contactOptions = [
    { value: '', label: 'Select a contact (optional)' },
    ...contacts.map(contact => ({
      value: contact.Id,
      label: `${contact.name} - ${contact.company || 'No Company'}`
    }))
  ]

  const dealOptions = [
    { value: '', label: 'Select a deal (optional)' },
    ...deals.map(deal => ({
      value: deal.Id,
      label: deal.title
    }))
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      <div className="grid grid-cols-1 gap-6">
        <Input
          label="Task Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Enter task title"
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            placeholder="Enter task description"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input
            label="Due Date"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
            required
          />
          
          <Select
            label="Priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            options={priorityOptions}
          />
          
          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={statusOptions}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Related Contact"
            name="contactId"
            value={formData.contactId}
            onChange={handleChange}
            options={contactOptions}
          />
          
          <Select
            label="Related Deal"
            name="dealId"
            value={formData.dealId}
            onChange={handleChange}
            options={dealOptions}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="min-w-[120px]"
        >
          {loading ? (
            <ApperIcon name="Loader2" size={16} className="animate-spin" />
          ) : (
            <>
              <ApperIcon name="Save" size={16} className="mr-2" />
              {task?.Id ? 'Update' : 'Create'} Task
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

export default TaskForm