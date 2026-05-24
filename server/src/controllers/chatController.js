import { chatService } from '../services/chatService.js'
import { successResponse } from '../utils/response.js'

export const getChatHistory = async (req, res, next) => {
  try {
    const { meetingId } = req.params
    const messages = await chatService.getMessagesByMeetingId(meetingId)
    return successResponse(res, { messages }, 'Chat history retrieved successfully', 200)
  } catch (error) {
    next(error)
  }
}
