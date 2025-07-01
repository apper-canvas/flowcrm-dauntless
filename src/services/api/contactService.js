import mockContacts from '@/services/mockData/contacts.json'

class ContactService {
  constructor() {
    this.contacts = [...mockContacts]
  }

  async getAll() {
    await this.delay()
    return [...this.contacts]
  }

  async getById(id) {
    await this.delay()
    const contact = this.contacts.find(c => c.Id === id)
    if (!contact) {
      throw new Error('Contact not found')
    }
    return { ...contact }
  }

  async create(contactData) {
    await this.delay()
    const newContact = {
      Id: Math.max(...this.contacts.map(c => c.Id), 0) + 1,
      ...contactData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.contacts.unshift(newContact)
    return { ...newContact }
  }

  async update(id, contactData) {
    await this.delay()
    const index = this.contacts.findIndex(c => c.Id === id)
    if (index === -1) {
      throw new Error('Contact not found')
    }
    
    this.contacts[index] = {
      ...this.contacts[index],
      ...contactData,
      Id: id,
      updatedAt: new Date().toISOString()
    }
    
    return { ...this.contacts[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.contacts.findIndex(c => c.Id === id)
    if (index === -1) {
      throw new Error('Contact not found')
    }
    
    this.contacts.splice(index, 1)
    return true
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))
  }
}

export const contactService = new ContactService()