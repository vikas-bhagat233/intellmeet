import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  assignedTo: { type: String },
  priority: { type: String, enum: ['Low','Medium','High','Critical'], default: 'Medium' },
  dueDate: { type: Date },
  status: { type: String, enum: ['ToDo','InProgress','Review','Completed'], default: 'ToDo' },
  attachments: [{
    name: { type: String },
    url: { type: String },
    size: { type: String }
  }],
}, { timestamps: true });

export default mongoose.model('Task', taskSchema);
