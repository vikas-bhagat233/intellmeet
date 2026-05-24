import Message from '../models/Message.js'

export const chatService = {
  saveMessage: async (meetingId, senderId, senderName, message, messageType = 'text') => {
    const msg = await Message.create({
      meetingId,
      senderId,
      senderName,
      message,
      messageType
    })
    return msg
  },

  getMessagesByMeetingId: async (meetingId) => {
    return Message.find({ meetingId }).sort('createdAt')
  }
}
