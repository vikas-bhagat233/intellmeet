import Task from '../models/Task.js'

export const projectTaskService = {
  createTask: async (title, description, projectId, assignedTo, priority, dueDate) => {
    const task = await Task.create({
      title,
      description,
      projectId,
      assignedTo: assignedTo || '',
      priority: priority || 'Medium',
      dueDate: dueDate ? new Date(dueDate) : null,
      status: 'ToDo'
    })
    return task
  },

  getTasksByProject: async (projectId) => {
    return Task.find({ projectId }).sort('createdAt')
  },

  getTaskById: async (taskId) => {
    return Task.findById(taskId)
  },

  updateTask: async (taskId, taskData) => {
    return Task.findByIdAndUpdate(taskId, taskData, { new: true })
  },

  deleteTask: async (taskId) => {
    return Task.findByIdAndDelete(taskId)
  }
}
