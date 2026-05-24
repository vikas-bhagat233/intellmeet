import api from './api'

export const meetingService = {
  createMeeting: async (data, token) => {
    const response = await api.post('/meetings/create', data, { headers: { Authorization: `Bearer ${token}` } })
    return response.data
  },
  
  getMyMeetings: async (token) => {
    const response = await api.get('/meetings/my-meetings', { headers: { Authorization: `Bearer ${token}` } })
    return response.data
  },
  
  getMeetingById: async (meetingId, token) => {
    const response = await api.get(`/meetings/${meetingId}`, { headers: { Authorization: `Bearer ${token}` } })
    return response.data
  }
}