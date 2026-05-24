import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  description: { type: String },
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['active', 'archived'], default: 'active' },
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);
