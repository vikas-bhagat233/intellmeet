import api from './api'

export const authService = {
  register: async (name, email, password, securityQuestion, securityAnswer) => {
    const response = await api.post('/auth/register', { name, email, password, securityQuestion, securityAnswer })
    const payload = response.data?.data
    if (payload?.token) localStorage.setItem('token', payload.token)
    return payload
  },
  
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    const payload = response.data?.data
    if (payload?.token) localStorage.setItem('token', payload.token)
    return payload
  },
  
  logout: () => {
    localStorage.removeItem('token')
  },
  
  getCurrentUser: async () => {
    const token = localStorage.getItem('token')
    if (!token) return null
    const response = await api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } })
    return response.data?.data
  }
}