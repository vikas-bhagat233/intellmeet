import axios from 'axios'

export const chatService = {
  getChatHistory: async (meetingId, token) => {
    const response = await axios.get(`/api/chat/${meetingId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data?.data?.messages || []
  }
}
