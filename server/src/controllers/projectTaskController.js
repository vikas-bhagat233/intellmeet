import { projectTaskService } from '../services/projectTaskService.js'
import { successResponse } from '../utils/response.js'
import { getIO } from '../config/socket.js'

export const createTask = async (req, res, next) => {
  try {
    const { title, description, projectId, assignedTo, priority, dueDate } = req.body
    const task = await projectTaskService.createTask(title, description, projectId, assignedTo, priority, dueDate)

    // Notify via Socket.io
    try {
      const io = getIO()
      io.emit('task-created', task)
    } catch (e) {
      console.warn('Socket notification failed:', e.message)
    }

    return successResponse(res, { task }, 'Project task created successfully', 201)
  } catch (error) {
    next(error)
  }
}

export const getTasks = async (req, res, next) => {
  try {
    const { projectId } = req.query
    const tasks = await projectTaskService.getTasksByProject(projectId)
    return successResponse(res, { tasks }, 'Project tasks retrieved successfully', 200)
  } catch (error) {
    next(error)
  }
}

export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params
    const task = await projectTaskService.updateTask(id, req.body)

    // Notify via Socket.io
    try {
      const io = getIO()
      io.emit('task-updated', task)
    } catch (e) {
      console.warn('Socket notification failed:', e.message)
    }

    return successResponse(res, { task }, 'Project task updated successfully', 200)
  } catch (error) {
    next(error)
  }
}

export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params
    await projectTaskService.deleteTask(id)
    return successResponse(res, null, 'Project task deleted successfully', 200)
  } catch (error) {
    next(error)
  }
}
