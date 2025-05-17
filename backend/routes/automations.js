import express from 'express';
import Automation from '../models/Automation.js';
import Project from '../models/Project.js';

const router = express.Router();

// Get all automations for a project
router.get('/projects/:projectId/automations', async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.uid;
    
    // Check if project exists and user is a member
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (!project.members.includes(userId) && project.ownerId !== userId) {
      return res.status(403).json({ message: 'Forbidden: Not a project member' });
    }
    
    const automations = await Automation.find({ projectId }).sort({ createdAt: -1 });
    
    res.status(200).json(automations);
  } catch (error) {
    console.error('Error fetching automations:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new automation
router.post('/', async (req, res) => {
  try {
    const { projectId, name, trigger, action } = req.body;
    const userId = req.user.uid;
    
    // Check if project exists and user is a member
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Only the owner can create automations
    if (project.ownerId !== userId) {
      return res.status(403).json({ message: 'Forbidden: Only the project owner can create automations' });
    }
    
    // Validate trigger and action
    if (!trigger || !trigger.type || !action || !action.type) {
      return res.status(400).json({ message: 'Invalid automation configuration' });
    }
    
    const automation = new Automation({
      projectId,
      name,
      trigger,
      action
    });
    
    await automation.save();
    
    res.status(201).json(automation);
  } catch (error) {
    console.error('Error creating automation:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update an automation
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, trigger, action } = req.body;
    const userId = req.user.uid;
    
    // Find the automation
    const automation = await Automation.findById(id);
    
    if (!automation) {
      return res.status(404).json({ message: 'Automation not found' });
    }
    
    // Check if user is the project owner
    const project = await Project.findById(automation.projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (project.ownerId !== userId) {
      return res.status(403).json({ message: 'Forbidden: Only the project owner can update automations' });
    }
    
    // Update the automation
    automation.name = name || automation.name;
    automation.trigger = trigger || automation.trigger;
    automation.action = action || automation.action;
    
    await automation.save();
    
    res.status(200).json(automation);
  } catch (error) {
    console.error('Error updating automation:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete an automation
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;
    
    // Find the automation
    const automation = await Automation.findById(id);
    
    if (!automation) {
      return res.status(404).json({ message: 'Automation not found' });
    }
    
    // Check if user is the project owner
    const project = await Project.findById(automation.projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (project.ownerId !== userId) {
      return res.status(403).json({ message: 'Forbidden: Only the project owner can delete automations' });
    }
    
    // Delete the automation
    await Automation.findByIdAndDelete(id);
    
    res.status(200).json({ message: 'Automation deleted successfully' });
  } catch (error) {
    console.error('Error deleting automation:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;