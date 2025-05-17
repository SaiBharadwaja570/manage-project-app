import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  ownerId: {
    type: String,
    required: true,
    ref: 'User'
  },
  members: [{
    type: String,
    ref: 'User'
  }],
  statuses: {
    type: [String],
    default: ['To Do', 'In Progress', 'Done']
  }
}, {
  timestamps: true
});

const Project = mongoose.model('Project', projectSchema);

export default Project;