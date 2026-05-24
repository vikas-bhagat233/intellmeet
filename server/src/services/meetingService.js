import Meeting from '../models/Meeting.js'

export const isUserInMeeting = async (meetingId, userId) => {
  const meeting = await Meeting.findOne({ meetingId })
  return meeting && meeting.participants.includes(userId)
}