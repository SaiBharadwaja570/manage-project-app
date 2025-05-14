import mongoose from 'mongoose';

const sprintSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  name: { type: String, required: true },
  goal: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  status: { type: String, enum: ['planning', 'active', 'completed'], default: 'planning' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Sprint", sprintSchema);