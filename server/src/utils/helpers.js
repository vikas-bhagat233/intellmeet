export const generateMeetingId = () => {
  return Math.random().toString(36).substring(2, 10).toUpperCase()
}

export const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id)
}