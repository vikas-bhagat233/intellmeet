import MeetingInsight from '../models/MeetingInsight.js'

export const meetingInsightService = {
  saveInsights: async (meetingId, { decisions, keywords, sentiment }) => {
    const insights = await MeetingInsight.findOneAndUpdate(
      { meetingId },
      {
        decisions: decisions || [],
        keywords: keywords || [],
        sentiment: sentiment || 'Neutral',
        generatedAt: new Date()
      },
      { new: true, upsert: true }
    )
    return insights
  },

  getInsightsByMeetingId: async (meetingId) => {
    return MeetingInsight.findOne({ meetingId })
  }
}
