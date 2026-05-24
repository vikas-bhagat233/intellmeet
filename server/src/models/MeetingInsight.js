import mongoose from 'mongoose'

const meetingInsightSchema = new mongoose.Schema({
  meetingId: { type: String, required: true, unique: true },
  decisions: [{ type: String }],
  keywords: [{ type: String }],
  sentiment: { type: String, default: '' },
  generatedAt: { type: Date, default: Date.now }
})

export default mongoose.model('MeetingInsight', meetingInsightSchema)
