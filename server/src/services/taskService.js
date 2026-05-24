import MeetingTask from '../models/MeetingTask.js'

export const taskService = {
  createTask: async (meetingId, title, assignedTo, dueDate = null) => {
    const task = await MeetingTask.create({
      meetingId,
      title,
      assignedTo: assignedTo || '',
      dueDate: dueDate ? new Date(dueDate) : null,
      status: 'pending'
    })
    return task
  },

  updateTaskStatus: async (taskId, status) => {
    const task = await MeetingTask.findByIdAndUpdate(
      taskId,
      { status },
      { new: true }
    )
    return task
  },

  getTasksByMeetingId: async (meetingId) => {
    return MeetingTask.find({ meetingId }).sort('-createdAt')
  }
}
