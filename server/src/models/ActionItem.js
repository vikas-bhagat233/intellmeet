import mongoose from 'mongoose'

const actionItemSchema = new mongoose.Schema({
  meetingId: { type: String, required: true },
  task: { type: String, required: true },
  assignedTo: { type: String, default: '' },
  deadline: { type: Date, default: null },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' }
}, { timestamps: true })

export default mongoose.model('ActionItem', actionItemSchema)
