import mongoose from 'mongoose';

const automationSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Project'
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  trigger: {
    type: {
      type: String,
      enum: ['status_change', 'assignment', 'due_date'],
      required: true
    },
    condition: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    }
  },
  action: {
    type: {
      type: String,
      enum: ['change_status', 'assign_badge', 'send_notification'],
      required: true
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    }
  }
}, {
  timestamps: true
});

const Automation = mongoose.model('Automation', automationSchema);

export default Automation;