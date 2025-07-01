import Badge from '@/components/atoms/Badge'

const StatusBadge = ({ status, type = 'contact' }) => {
  const getStatusConfig = (status, type) => {
    if (type === 'contact') {
      switch (status) {
        case 'active':
          return { variant: 'success', label: 'Active' }
        case 'inactive':
          return { variant: 'default', label: 'Inactive' }
        case 'lead':
          return { variant: 'info', label: 'Lead' }
        default:
          return { variant: 'default', label: status }
      }
    }
    
    if (type === 'deal') {
      switch (status) {
        case 'lead':
          return { variant: 'info', label: 'Lead' }
        case 'qualified':
          return { variant: 'primary', label: 'Qualified' }
        case 'proposal':
          return { variant: 'warning', label: 'Proposal' }
        case 'negotiation':
          return { variant: 'secondary', label: 'Negotiation' }
        case 'closed_won':
          return { variant: 'success', label: 'Closed Won' }
        case 'closed_lost':
          return { variant: 'error', label: 'Closed Lost' }
        default:
          return { variant: 'default', label: status }
      }
    }
    
    if (type === 'task') {
      switch (status) {
        case 'pending':
          return { variant: 'warning', label: 'Pending' }
        case 'in_progress':
          return { variant: 'info', label: 'In Progress' }
        case 'completed':
          return { variant: 'success', label: 'Completed' }
        default:
          return { variant: 'default', label: status }
      }
    }
    
    return { variant: 'default', label: status }
  }

  const { variant, label } = getStatusConfig(status, type)

  return <Badge variant={variant}>{label}</Badge>
}

export default StatusBadge