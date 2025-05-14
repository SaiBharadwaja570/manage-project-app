import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'project_manager', 'developer'], default: 'developer' },
    createdProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    assignedIssues: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Issue' }],
    createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model("User", userSchema);