export const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

export const generateMeetingId = () => {
  return Math.random().toString(36).substring(2, 10).toUpperCase()
}