import SharedNote from '../models/SharedNote.js'

export const noteService = {
  saveNoteContent: async (meetingId, content, userId, userName) => {
    const note = await SharedNote.findOneAndUpdate(
      { meetingId },
      { content, lastEditedBy: userId, lastEditedByName: userName },
      { new: true, upsert: true }
    )
    return note
  },

  getNoteByMeetingId: async (meetingId) => {
    return SharedNote.findOne({ meetingId })
  }
}
