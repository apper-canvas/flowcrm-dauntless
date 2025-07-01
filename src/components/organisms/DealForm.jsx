import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import ApperIcon from '@/components/ApperIcon'
import { dealService } from '@/services/api/dealService'
import { contactService } from '@/services/api/contactService'

const DealForm = ({ deal, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: deal?.title || '',
    value: deal?.value || '',
    stage: deal?.stage || 'lead',
    probability: deal?.probability || 10,
    contactId: deal?.contactId || '',
    expectedClose: deal?.expectedClose || ''
  })
  
  const [loading, setLoading] = useState(false)
  const [contacts, setContacts] = useState([])

  const stageOptions = [
    { value: 'lead', label: 'Lead' },
    { value: 'qualified', label: 'Qualified' },
    { value: 'proposal', label: 'Proposal' },
    { value: 'negotiation', label: 'Negotiation' },
    { value: 'closed_won', label: 'Closed Won' },
    { value: 'closed_lost', label: 'Closed Lost' }
  ]

  useEffect(() => {
    loadContacts()
  }, [])

  const loadContacts = async () => {
    try {
      const contactsData = await contactService.getAll()
      setContacts(contactsData)
    } catch (error) {
      console.error('Failed to load contacts:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const dealData = {
        ...formData,
        value: parseFloat(formData.value) || 0,
        probability: parseInt(formData.probability) || 10
      }

      let savedDeal
      if (deal?.Id) {
        savedDeal = await dealService.update(deal.Id, dealData)
        toast.success('Deal updated successfully!')
      } else {
        savedDeal = await dealService.create(dealData)
        toast.success('Deal created successfully!')
      }

      if (onSave) {
        onSave(savedDeal)
      }
    } catch (error) {
      toast.error('Failed to save deal. Please try again.')
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
    { value: '', label: 'Select a contact' },
    ...contacts.map(contact => ({
      value: contact.Id,
      label: `${contact.name} - ${contact.company || 'No Company'}`
    }))
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Deal Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Enter deal title"
        />
        
        <Input
          label="Deal Value"
          name="value"
          type="number"
          value={formData.value}
          onChange={handleChange}
          required
          placeholder="Enter deal value"
        />
        
        <Select
          label="Stage"
          name="stage"
          value={formData.stage}
          onChange={handleChange}
          options={stageOptions}
        />
        
        <Input
          label="Probability (%)"
          name="probability"
          type="number"
          min="0"
          max="100"
          value={formData.probability}
          onChange={handleChange}
          placeholder="Enter probability"
        />
        
        <Select
          label="Contact"
          name="contactId"
          value={formData.contactId}
          onChange={handleChange}
          options={contactOptions}
          required
        />
        
        <Input
          label="Expected Close Date"
          name="expectedClose"
          type="date"
          value={formData.expectedClose}
          onChange={handleChange}
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
              {deal?.Id ? 'Update' : 'Create'} Deal
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

export default DealForm