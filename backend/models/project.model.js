import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // invited users
  createdAt: { type: Date, default: Date.now },
});

const Project = mongoose.model("Project", ProjectSchema);
export default Project;
