import mongoose from 'mongoose'

const summarySchema = new mongoose.Schema({
  meetingId: { type: String, required: true, unique: true },
  summary: { type: String, required: true },
  generatedAt: { type: Date, default: Date.now }
})

export default mongoose.model('Summary', summarySchema)
