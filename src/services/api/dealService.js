import mockDeals from '@/services/mockData/deals.json'

class DealService {
  constructor() {
    this.deals = [...mockDeals]
  }

  async getAll() {
    await this.delay()
    return [...this.deals]
  }

  async getById(id) {
    await this.delay()
    const deal = this.deals.find(d => d.Id === id)
    if (!deal) {
      throw new Error('Deal not found')
    }
    return { ...deal }
  }

  async create(dealData) {
    await this.delay()
    const newDeal = {
      Id: Math.max(...this.deals.map(d => d.Id), 0) + 1,
      ...dealData,
      createdAt: new Date().toISOString()
    }
    this.deals.unshift(newDeal)
    return { ...newDeal }
  }

  async update(id, dealData) {
    await this.delay()
    const index = this.deals.findIndex(d => d.Id === id)
    if (index === -1) {
      throw new Error('Deal not found')
    }
    
    this.deals[index] = {
      ...this.deals[index],
      ...dealData,
      Id: id
    }
    
    return { ...this.deals[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.deals.findIndex(d => d.Id === id)
    if (index === -1) {
      throw new Error('Deal not found')
    }
    
    this.deals.splice(index, 1)
    return true
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))
  }
}

export const dealService = new DealService()