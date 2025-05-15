// models/automation.model.js

import mongoose from 'mongoose';

const automationSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  trigger: {
    type: String,
    enum: ['status_changed', 'task_assigned', 'due_date_passed'],
    required: true
  },
  condition: {
    type: Object,
    required: true
    // Example:
    // For status_changed: { from: "In Progress", to: "Done" }
    // For task_assigned: { assignee: userId }
    // For due_date_passed: { }
  },
  action: {
    type: Object,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model('Automation', automationSchema);