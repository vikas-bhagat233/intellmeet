import axios from 'axios'

export const notesService = {
  getSharedNote: async (meetingId, token) => {
    const response = await axios.get(`/api/notes/${meetingId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data?.data?.note || null
  },

  updateSharedNote: async (meetingId, content, token) => {
    const response = await axios.post('/api/notes/update', { meetingId, content }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data?.data?.note || null
  }
}
