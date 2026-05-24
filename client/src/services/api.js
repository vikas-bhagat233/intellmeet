import axios from 'axios'

const api = axios.create({
  // Use Vite-provided API URL in build, otherwise fall back to relative '/api'
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' }
})

export default api