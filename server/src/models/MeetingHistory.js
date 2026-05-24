import mongoose from 'mongoose'

const meetingHistorySchema = new mongoose.Schema({
  meetingId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hostName: { type: String, required: true },
  participants: [{ type: String }],
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  duration: { type: Number, required: true } // Duration in minutes
}, { timestamps: true })

export default mongoose.model('MeetingHistory', meetingHistorySchema)
