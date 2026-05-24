import mongoose from 'mongoose'

const meetingSchema = new mongoose.Schema({
  meetingId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['scheduled', 'active', 'ended'], default: 'scheduled' },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  recordingUrl: { type: String, default: '' }
}, { timestamps: true })

export default mongoose.model('Meeting', meetingSchema)