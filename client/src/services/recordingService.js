import axios from 'axios'

export const recordingService = {
  getRecording: async (meetingId, token) => {
    const response = await axios.get(`/api/recordings/${meetingId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data?.data?.recording || null
  },

  deleteRecording: async (meetingId, token) => {
    const response = await axios.delete(`/api/recordings/${meetingId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  }
}
