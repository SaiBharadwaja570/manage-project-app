import express from 'express';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import User from '../models/User.js';
import { isProjectMember } from '../middleware/auth.js';

const router = express.Router();

// Get all projects for the authenticated user
router.get('/', async (req, res) => {
  try {
    const userId = req.user.uid;
    
    const projects = await Project.find({
      $or: [
        { ownerId: userId },
        { members: userId }
      ]
    }).sort({ updatedAt: -1 });
    
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific project
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;
    
    const project = await Project.findById(id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user is a member of the project
    if (!project.members.includes(userId) && project.ownerId !== userId) {
      return res.status(403).json({ message: 'Forbidden: Not a project member' });
    }
    
    res.status(200).json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new project
router.post('/', async (req, res) => {
  try {
    const { title, description, statuses } = req.body;
    const userId = req.user.uid;
    
    const project = new Project({
      title,
      description,
      ownerId: userId,
      members: [userId],
      statuses: statuses || ['To Do', 'In Progress', 'Done']
    });
    
    await project.save();
    
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a project
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, statuses } = req.body;
    const userId = req.user.uid;
    
    const project = await Project.findById(id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Only the owner can update the project
    if (project.ownerId !== userId) {
      return res.status(403).json({ message: 'Forbidden: Not the project owner' });
    }
    
    project.title = title || project.title;
    project.description = description || project.description;
    project.statuses = statuses || project.statuses;
    
    await project.save();
    
    res.status(200).json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a project
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;
    
    const project = await Project.findById(id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Only the owner can delete the project
    if (project.ownerId !== userId) {
      return res.status(403).json({ message: 'Forbidden: Not the project owner' });
    }
    
    // Delete all tasks associated with the project
    await Task.deleteMany({ projectId: id });
    
    // Delete the project
    await Project.findByIdAndDelete(id);
    
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Invite a user to a project
router.post('/:id/invite', async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;
    const userId = req.user.uid;
    
    const project = await Project.findById(id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Only the owner or members can invite others
    if (project.ownerId !== userId && !project.members.includes(userId)) {
      return res.status(403).json({ message: 'Forbidden: Not authorized to invite' });
    }
    
    // Find the user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user is already a member
    if (project.members.includes(user._id)) {
      return res.status(400).json({ message: 'User is already a member of this project' });
    }
    
    // Add user to project members
    project.members.push(user._id);
    await project.save();
    
    res.status(200).json({ message: 'User invited successfully' });
  } catch (error) {
    console.error('Error inviting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all tasks for a project
router.get('/:id/tasks', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;
    
    const project = await Project.findById(id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user is a member of the project
    if (!project.members.includes(userId) && project.ownerId !== userId) {
      return res.status(403).json({ message: 'Forbidden: Not a project member' });
    }
    
    const tasks = await Task.find({ projectId: id }).sort({ updatedAt: -1 });
    
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;