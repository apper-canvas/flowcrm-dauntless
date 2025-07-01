import { useState } from 'react'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import ApperIcon from '@/components/ApperIcon'
import { contactService } from '@/services/api/contactService'

const ContactForm = ({ contact, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: contact?.name || '',
    email: contact?.email || '',
    phone: contact?.phone || '',
    company: contact?.company || '',
    status: contact?.status || 'active',
    tags: contact?.tags?.join(', ') || ''
  })
  
  const [loading, setLoading] = useState(false)

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'lead', label: 'Lead' }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const contactData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      }

      let savedContact
      if (contact?.Id) {
        savedContact = await contactService.update(contact.Id, contactData)
        toast.success('Contact updated successfully!')
      } else {
        savedContact = await contactService.create(contactData)
        toast.success('Contact created successfully!')
      }

      if (onSave) {
        onSave(savedContact)
      }
    } catch (error) {
      toast.error('Failed to save contact. Please try again.')
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Enter full name"
        />
        
        <Input
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="Enter email address"
        />
        
        <Input
          label="Phone Number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter phone number"
        />
        
        <Input
          label="Company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          placeholder="Enter company name"
        />
        
        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={statusOptions}
        />
        
        <Input
          label="Tags"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="Enter tags separated by commas"
        />
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
              {contact?.Id ? 'Update' : 'Create'} Contact
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

export default ContactForm