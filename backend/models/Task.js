import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Project'
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    required: true
  },
  dueDate: {
    type: Date
  },
  assigneeId: {
    type: String,
    ref: 'User'
  },
  createdBy: {
    type: String,
    required: true,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for faster queries
taskSchema.index({ projectId: 1, status: 1 });
taskSchema.index({ assigneeId: 1 });
taskSchema.index({ dueDate: 1 });

const Task = mongoose.model('Task', taskSchema);

export default Task;