export const API_URL = import.meta.env.VITE_API_URL || '/api'
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || undefined

export const MEETING_STATUS = {
  ACTIVE: 'active',
  ENDED: 'ended',
  SCHEDULED: 'scheduled'
}