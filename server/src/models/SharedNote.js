import mongoose from 'mongoose'

const sharedNoteSchema = new mongoose.Schema({
  meetingId: { type: String, required: true, unique: true },
  content: { type: String, default: '' },
  lastEditedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lastEditedByName: { type: String, default: '' }
}, { timestamps: true })

export default mongoose.model('SharedNote', sharedNoteSchema)
