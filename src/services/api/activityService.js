import mockActivities from '@/services/mockData/activities.json'

class ActivityService {
  constructor() {
    this.activities = [...mockActivities]
  }

  async getAll() {
    await this.delay()
    return [...this.activities]
  }

  async getById(id) {
    await this.delay()
    const activity = this.activities.find(a => a.Id === id)
    if (!activity) {
      throw new Error('Activity not found')
    }
    return { ...activity }
  }

  async create(activityData) {
    await this.delay()
    const newActivity = {
      Id: Math.max(...this.activities.map(a => a.Id), 0) + 1,
      ...activityData,
      timestamp: new Date().toISOString()
    }
    this.activities.unshift(newActivity)
    return { ...newActivity }
  }

  async update(id, activityData) {
    await this.delay()
    const index = this.activities.findIndex(a => a.Id === id)
    if (index === -1) {
      throw new Error('Activity not found')
    }
    
    this.activities[index] = {
      ...this.activities[index],
      ...activityData,
      Id: id
    }
    
    return { ...this.activities[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.activities.findIndex(a => a.Id === id)
    if (index === -1) {
      throw new Error('Activity not found')
    }
    
    this.activities.splice(index, 1)
    return true
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))
  }
}

export const activityService = new ActivityService()