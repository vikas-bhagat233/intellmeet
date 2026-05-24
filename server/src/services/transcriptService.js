import Transcript from '../models/Transcript.js'

export const transcriptService = {
  saveTranscriptSegment: async (meetingId, speaker, text, timestamp) => {
    const segment = await Transcript.create({
      meetingId,
      speaker: speaker || 'Unknown Speaker',
      text,
      timestamp: timestamp || new Date().toISOString()
    })
    return segment
  },

  getTranscriptByMeetingId: async (meetingId) => {
    return Transcript.find({ meetingId }).sort('createdAt')
  }
}
