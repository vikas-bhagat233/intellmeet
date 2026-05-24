import { noteService } from '../services/noteService.js'
import { successResponse } from '../utils/response.js'

export const getSharedNote = async (req, res, next) => {
  try {
    const { meetingId } = req.params
    let note = await noteService.getNoteByMeetingId(meetingId)
    if (!note) {
      note = await noteService.saveNoteContent(meetingId, '', req.userId, '')
    }
    return successResponse(res, { note }, 'Shared note retrieved successfully', 200)
  } catch (error) {
    next(error)
  }
}

export const updateSharedNote = async (req, res, next) => {
  try {
    const { meetingId, content } = req.body
    const note = await noteService.saveNoteContent(meetingId, content || '', req.userId, req.user?.name || '')
    return successResponse(res, { note }, 'Shared note updated successfully', 200)
  } catch (error) {
    next(error)
  }
}
