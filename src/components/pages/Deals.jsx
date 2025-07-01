import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Modal from '@/components/molecules/Modal'
import StatusBadge from '@/components/molecules/StatusBadge'
import DealForm from '@/components/organisms/DealForm'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { dealService } from '@/services/api/dealService'
import { contactService } from '@/services/api/contactService'
import { format } from 'date-fns'

const Deals = () => {
  const [deals, setDeals] = useState([])
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingDeal, setEditingDeal] = useState(null)
  const [draggedDeal, setDraggedDeal] = useState(null)

  const stages = [
    { id: 'lead', name: 'Lead', color: 'bg-blue-500' },
    { id: 'qualified', name: 'Qualified', color: 'bg-indigo-500' },
    { id: 'proposal', name: 'Proposal', color: 'bg-yellow-500' },
    { id: 'negotiation', name: 'Negotiation', color: 'bg-purple-500' },
    { id: 'closed_won', name: 'Closed Won', color: 'bg-green-500' }
  ]

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const [dealsData, contactsData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll()
      ])
      setDeals(dealsData)
      setContacts(contactsData)
    } catch (err) {
      setError('Failed to load deals')
      console.error('Deals load error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveDeal = (savedDeal) => {
    if (editingDeal) {
      setDeals(prev => prev.map(d => d.Id === savedDeal.Id ? savedDeal : d))
    } else {
      setDeals(prev => [savedDeal, ...prev])
    }
    
    setShowCreateModal(false)
    setEditingDeal(null)
  }

  const handleDeleteDeal = async (dealId) => {
    if (!confirm('Are you sure you want to delete this deal?')) return

    try {
      await dealService.delete(dealId)
      setDeals(prev => prev.filter(d => d.Id !== dealId))
      toast.success('Deal deleted successfully')
    } catch (error) {
      toast.error('Failed to delete deal')
    }
  }

  const handleEditDeal = (deal) => {
    setEditingDeal(deal)
    setShowCreateModal(true)
  }

  const handleDragStart = (e, deal) => {
    setDraggedDeal(deal)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e, targetStage) => {
    e.preventDefault()
    
    if (!draggedDeal || draggedDeal.stage === targetStage) {
      setDraggedDeal(null)
      return
    }

    try {
      const updatedDeal = await dealService.update(draggedDeal.Id, { 
        ...draggedDeal, 
        stage: targetStage 
      })
      
      setDeals(prev => prev.map(d => d.Id === updatedDeal.Id ? updatedDeal : d))
      toast.success(`Deal moved to ${stages.find(s => s.id === targetStage)?.name}`)
    } catch (error) {
      toast.error('Failed to update deal stage')
    }
    
    setDraggedDeal(null)
  }

  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.Id === contactId)
    return contact ? contact.name : 'Unknown Contact'
  }

  const getStageDeals = (stageId) => {
    return deals.filter(deal => deal.stage === stageId)
  }

  const getTotalValue = (stageDeals) => {
    return stageDeals.reduce((sum, deal) => sum + (deal.value || 0), 0)
  }

  if (loading) return <Loading type="pipeline" />
  if (error) return <Error message={error} onRetry={loadData} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Sales Pipeline
          </h1>
          <p className="text-gray-600 mt-1">
            Track your deals through the sales process
          </p>
        </div>
        
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="mt-4 sm:mt-0"
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Deal
        </Button>
      </div>

      {/* Pipeline Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Total Deals</p>
              <p className="text-3xl font-bold text-blue-900">{deals.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingUp" size={24} className="text-white" />
            </div>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Won Deals</p>
              <p className="text-3xl font-bold text-green-900">
                {deals.filter(d => d.stage === 'closed_won').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckCircle" size={24} className="text-white" />
            </div>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-700">Pipeline Value</p>
              <p className="text-3xl font-bold text-yellow-900">
                ${deals.filter(d => !['closed_won', 'closed_lost'].includes(d.stage))
                      .reduce((sum, deal) => sum + (deal.value || 0), 0)
                      .toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="DollarSign" size={24} className="text-white" />
            </div>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Win Rate</p>
              <p className="text-3xl font-bold text-purple-900">
                {deals.length > 0 
                  ? Math.round((deals.filter(d => d.stage === 'closed_won').length / deals.length) * 100)
                  : 0}%
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="Target" size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Board */}
      {deals.length === 0 && !loading ? (
        <Empty
          type="deals"
          onAction={() => setShowCreateModal(true)}
        />
      ) : (
        <div className="bg-white rounded-xl card-shadow p-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-[600px]">
            {stages.map((stage, stageIndex) => {
              const stageDeals = getStageDeals(stage.id)
              const totalValue = getTotalValue(stageDeals)
              
              return (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: stageIndex * 0.1 }}
                  className="space-y-4"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, stage.id)}
                >
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                      <h3 className="font-semibold text-gray-900">{stage.name}</h3>
                      <Badge variant="default">{stageDeals.length}</Badge>
                    </div>
                  </div>
                  
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <p className="text-xs text-gray-500">Total Value</p>
                    <p className="text-sm font-semibold text-gray-900">
                      ${totalValue.toLocaleString()}
                    </p>
                  </div>

                  <div className="space-y-3 min-h-[400px]">
                    {stageDeals.map((deal, dealIndex) => (
                      <motion.div
                        key={deal.Id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: dealIndex * 0.05 }}
                        draggable
                        onDragStart={(e) => handleDragStart(e, deal)}
                        className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-move group"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900 text-sm leading-tight">
                            {deal.title}
                          </h4>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditDeal(deal)}
                              className="p-1 h-6 w-6"
                            >
                              <ApperIcon name="Edit" size={12} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteDeal(deal.Id)}
                              className="p-1 h-6 w-6 text-red-600 hover:text-red-700"
                            >
                              <ApperIcon name="Trash2" size={12} />
                            </Button>
                          </div>
                        </div>
                        
                        <p className="text-lg font-bold text-gray-900 mb-2">
                          ${deal.value?.toLocaleString() || 0}
                        </p>
                        
                        <p className="text-xs text-gray-600 mb-2">
                          {getContactName(deal.contactId)}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <Badge 
                            variant={deal.probability >= 75 ? 'success' : deal.probability >= 50 ? 'warning' : 'default'}
                            size="sm"
                          >
                            {deal.probability}%
                          </Badge>
                          
                          {deal.expectedClose && (
                            <p className="text-xs text-gray-500">
                              {format(new Date(deal.expectedClose), 'MMM d')}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false)
          setEditingDeal(null)
        }}
        title={editingDeal ? 'Edit Deal' : 'Create New Deal'}
        size="lg"
      >
        <DealForm
          deal={editingDeal}
          onSave={handleSaveDeal}
          onCancel={() => {
            setShowCreateModal(false)
            setEditingDeal(null)
          }}
        />
      </Modal>
    </div>
  )
}

export default Deals