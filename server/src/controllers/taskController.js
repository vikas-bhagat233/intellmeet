import { taskService } from '../services/taskService.js'
import { successResponse } from '../utils/response.js'

export const getMeetingTasks = async (req, res, next) => {
  try {
    const { meetingId } = req.params
    const tasks = await taskService.getTasksByMeetingId(meetingId)
    return successResponse(res, { tasks }, 'Meeting tasks retrieved successfully', 200)
  } catch (error) {
    next(error)
  }
}

export const createMeetingTask = async (req, res, next) => {
  try {
    const { meetingId, title, assignedTo, dueDate } = req.body
    const task = await taskService.createTask(meetingId, title, assignedTo, dueDate)
    return successResponse(res, { task }, 'Meeting task created successfully', 201)
  } catch (error) {
    next(error)
  }
}

export const updateMeetingTaskStatus = async (req, res, next) => {
  try {
    const { taskId } = req.params
    const { status } = req.body
    const task = await taskService.updateTaskStatus(taskId, status)
    return successResponse(res, { task }, 'Meeting task status updated successfully', 200)
  } catch (error) {
    next(error)
  }
}
