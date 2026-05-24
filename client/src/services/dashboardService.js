import axios from 'axios'

export const dashboardService = {
  getStats: async (token) => {
    const response = await axios.get('/api/dashboard/stats', {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data?.data?.stats || null
  }
}
