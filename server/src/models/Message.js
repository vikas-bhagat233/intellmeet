import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
  meetingId: { type: String, required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderName: { type: String, required: true },
  message: { type: String, required: true },
  messageType: { type: String, enum: ['text', 'file'], default: 'text' }
}, { timestamps: true })

export default mongoose.model('Message', messageSchema)
