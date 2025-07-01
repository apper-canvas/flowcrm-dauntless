import mockTasks from '@/services/mockData/tasks.json'

class TaskService {
  constructor() {
    this.tasks = [...mockTasks]
  }

  async getAll() {
    await this.delay()
    return [...this.tasks]
  }

  async getById(id) {
    await this.delay()
    const task = this.tasks.find(t => t.Id === id)
    if (!task) {
      throw new Error('Task not found')
    }
    return { ...task }
  }

  async create(taskData) {
    await this.delay()
    const newTask = {
      Id: Math.max(...this.tasks.map(t => t.Id), 0) + 1,
      ...taskData,
      createdAt: new Date().toISOString()
    }
    this.tasks.unshift(newTask)
    return { ...newTask }
  }

  async update(id, taskData) {
    await this.delay()
    const index = this.tasks.findIndex(t => t.Id === id)
    if (index === -1) {
      throw new Error('Task not found')
    }
    
    this.tasks[index] = {
      ...this.tasks[index],
      ...taskData,
      Id: id
    }
    
    return { ...this.tasks[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.tasks.findIndex(t => t.Id === id)
    if (index === -1) {
      throw new Error('Task not found')
    }
    
    this.tasks.splice(index, 1)
    return true
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))
  }
}

export const taskService = new TaskService()