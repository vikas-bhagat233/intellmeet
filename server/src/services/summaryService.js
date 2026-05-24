import Summary from '../models/Summary.js'

export const summaryService = {
  saveSummary: async (meetingId, summaryText) => {
    // Upsert the summary for the meeting
    const summary = await Summary.findOneAndUpdate(
      { meetingId },
      { summary: summaryText, generatedAt: new Date() },
      { new: true, upsert: true }
    )
    return summary
  },

  getSummaryByMeetingId: async (meetingId) => {
    return Summary.findOne({ meetingId })
  }
}
