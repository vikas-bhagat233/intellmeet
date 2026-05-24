import mongoose from 'mongoose'

const sharedFileSchema = new mongoose.Schema({
  meetingId: { type: String, required: true },
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  uploadedByName: { type: String, required: true }
}, { timestamps: { createdAt: 'uploadedAt', updatedAt: false } })

export default mongoose.model('SharedFile', sharedFileSchema)
