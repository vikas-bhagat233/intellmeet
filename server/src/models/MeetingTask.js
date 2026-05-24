import mongoose from 'mongoose'

const meetingTaskSchema = new mongoose.Schema({
  meetingId: { type: String, required: true },
  title: { type: String, required: true },
  assignedTo: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  dueDate: { type: Date, default: null }
}, { timestamps: true })

export default mongoose.model('MeetingTask', meetingTaskSchema)
