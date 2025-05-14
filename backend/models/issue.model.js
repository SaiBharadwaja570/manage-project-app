import mongoose from 'mongoose';

// Issue Schema
const issueSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  issueKey: { type: String, required: true },
  summary: { type: String, required: true },
  description: { type: String },
  issueType: { type: String, enum: ['bug', 'task', 'story', 'epic'], default: 'task' },
  status: { type: String, enum: ['to-do', 'in-progress', 'review', 'done'], default: 'to-do' },
  priority: { type: String, enum: ['highest', 'high', 'medium', 'low', 'lowest'], default: 'medium' },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sprint: { type: mongoose.Schema.Types.ObjectId, ref: 'Sprint' },
  comments: [{
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    body: { type: String },
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Issue", issueSchema);