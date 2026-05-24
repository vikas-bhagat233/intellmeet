import axios from 'axios'

export const taskService = {
  getTasks: async (meetingId, token) => {
    const response = await axios.get(`/api/tasks/${meetingId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data?.data?.tasks || []
  },

  createTask: async (meetingId, title, assignedTo, dueDate, token) => {
    const response = await axios.post('/api/tasks/create', { meetingId, title, assignedTo, dueDate }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data?.data?.task || null
  },

  updateTaskStatus: async (taskId, status, token) => {
    const response = await axios.patch(`/api/tasks/${taskId}/status`, { status }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data?.data?.task || null
  },

  // Project Kanban Tasks
  getProjectTasks: async (projectId, token) => {
    const response = await axios.get(`/api/project-tasks?projectId=${projectId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data?.data?.tasks || []
  },

  createProjectTask: async (taskData, token) => {
    const response = await axios.post('/api/project-tasks', taskData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data?.data?.task || null
  },

  updateProjectTask: async (taskId, taskData, token) => {
    const response = await axios.put(`/api/project-tasks/${taskId}`, taskData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data?.data?.task || null
  },

  deleteProjectTask: async (taskId, token) => {
    await axios.delete(`/api/project-tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
  },

  // Comments
  getComments: async (taskId, token) => {
    const response = await axios.get(`/api/comments?taskId=${taskId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data?.data?.comments || []
  },

  addComment: async (taskId, comment, token) => {
    const response = await axios.post('/api/comments', { taskId, comment }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data?.data?.comment || null
  },

  deleteComment: async (commentId, token) => {
    await axios.delete(`/api/comments/${commentId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
  }
}
