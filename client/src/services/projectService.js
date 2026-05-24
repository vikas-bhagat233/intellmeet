import axios from 'axios'

export const projectService = {
  getProjects: async (teamId, token) => {
    const response = await axios.get(`/api/projects?teamId=${teamId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data?.data?.projects || []
  },

  createProject: async (projectName, description, teamId, token) => {
    const response = await axios.post('/api/projects', { projectName, description, teamId }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data?.data?.project || null
  },

  updateProject: async (projectId, projectData, token) => {
    const response = await axios.put(`/api/projects/${projectId}`, projectData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data?.data?.project || null
  },

  deleteProject: async (projectId, token) => {
    await axios.delete(`/api/projects/${projectId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
  },

  addProjectMember: async (projectId, userId, token) => {
    const response = await axios.post(`/api/projects/${projectId}/add-member`, { userId }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data?.data?.project || null
  },

  removeProjectMember: async (projectId, userId, token) => {
    const response = await axios.post(`/api/projects/${projectId}/remove-member`, { userId }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data?.data?.project || null
  }
}
