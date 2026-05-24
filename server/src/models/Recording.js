import mongoose from 'mongoose'

const recordingSchema = new mongoose.Schema({
  meetingId: { type: String, required: true, unique: true },
  recordingUrl: { type: String, required: true },
  size: { type: Number, default: 0 }, // Size in bytes
  duration: { type: Number, default: 0 } // Duration in seconds
}, { timestamps: { createdAt: 'uploadedAt', updatedAt: false } })

export default mongoose.model('Recording', recordingSchema)
