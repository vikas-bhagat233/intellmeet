import mongoose from 'mongoose'

const transcriptSchema = new mongoose.Schema({
  meetingId: { type: String, required: true },
  speaker: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: String, required: true }
}, { timestamps: { createdAt: true, updatedAt: false } })

export default mongoose.model('Transcript', transcriptSchema)
