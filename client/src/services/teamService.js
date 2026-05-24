import axios from 'axios'

export const teamService = {
  getTeams: async (token) => {
    const response = await axios.get('/api/teams', {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data?.data?.teams || []
  },

  createTeam: async (teamName, description, token) => {
    const response = await axios.post('/api/teams', { teamName, description }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data?.data?.team || null
  },

  updateTeam: async (teamId, teamData, token) => {
    const response = await axios.put(`/api/teams/${teamId}`, teamData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data?.data?.team || null
  },

  deleteTeam: async (teamId, token) => {
    await axios.delete(`/api/teams/${teamId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
  },

  inviteMember: async (teamId, email, token) => {
    const response = await axios.post(`/api/teams/${teamId}/invite`, { email }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data?.data?.team || null
  },

  removeMember: async (teamId, userId, token) => {
    const response = await axios.post(`/api/teams/${teamId}/remove`, { userId }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data?.data?.team || null
  }
}
