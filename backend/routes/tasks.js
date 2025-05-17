import express from 'express';
import Task from '../models/Task.js';
import Project from '../models/Project.js';
import Automation from '../models/Automation.js';
import { processAutomations } from '../services/automationService.js';

const router = express.Router();

// Create a new task
router.post('/', async (req, res) => {
  try {
    const { projectId, title, description, status, dueDate, assigneeId } = req.body;
    const userId = req.user.uid;
    
    // Check if project exists and user is a member
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (!project.members.includes(userId) && project.ownerId !== userId) {
      return res.status(403).json({ message: 'Forbidden: Not a project member' });
    }
    
    // Create the task
    const task = new Task({
      projectId,
      title,
      description,
      status: status || 'To Do',
      dueDate,
      assigneeId,
      createdBy: userId
    });
    
    await task.save();
    
    // Process automations for task creation
    if (assigneeId) {
      await processAutomations(task, 'assignment');
    }
    
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a task
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, dueDate, assigneeId } = req.body;
    const userId = req.user.uid;
    
    // Find the task
    const task = await Task.findById(id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Check if user is a member of the project
    const project = await Project.findById(task.projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (!project.members.includes(userId) && project.ownerId !== userId) {
      return res.status(403).json({ message: 'Forbidden: Not a project member' });
    }
    
    // Track changes for automation triggers
    const oldStatus = task.status;
    const oldAssignee = task.assigneeId;
    
    // Update the task
    task.title = title || task.title;
    task.description = description !== undefined ? description : task.description;
    task.status = status || task.status;
    task.dueDate = dueDate !== undefined ? dueDate : task.dueDate;
    task.assigneeId = assigneeId !== undefined ? assigneeId : task.assigneeId;
    
    await task.save();
    
    // Process automations based on changes
    if (status && status !== oldStatus) {
      await processAutomations(task, 'status_change');
    }
    
    if (assigneeId && assigneeId !== oldAssignee) {
      await processAutomations(task, 'assignment');
    }
    
    res.status(200).json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;
    
    // Find the task
    const task = await Task.findById(id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Check if user is a member of the project
    const project = await Project.findById(task.projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (!project.members.includes(userId) && project.ownerId !== userId) {
      return res.status(403).json({ message: 'Forbidden: Not a project member' });
    }
    
    // Delete the task
    await Task.findByIdAndDelete(id);
    
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update task status
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.uid;
    
    // Find the task
    const task = await Task.findById(id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Check if user is a member of the project
    const project = await Project.findById(task.projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (!project.members.includes(userId) && project.ownerId !== userId) {
      return res.status(403).json({ message: 'Forbidden: Not a project member' });
    }
    
    // Check if the status is valid
    if (!project.statuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    // Update the task status
    task.status = status;
    await task.save();
    
    // Process automations for status change
    await processAutomations(task, 'status_change');
    
    res.status(200).json(task);
  } catch (error) {
    console.error('Error updating task status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Assign task to user
router.put('/:id/assign', async (req, res) => {
  try {
    const { id } = req.params;
    const { assigneeId } = req.body;
    const userId = req.user.uid;
    
    // Find the task
    const task = await Task.findById(id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Check if user is a member of the project
    const project = await Project.findById(task.projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (!project.members.includes(userId) && project.ownerId !== userId) {
      return res.status(403).json({ message: 'Forbidden: Not a project member' });
    }
    
    // If assigneeId is provided, check if the assignee is a member of the project
    if (assigneeId && !project.members.includes(assigneeId) && project.ownerId !== assigneeId) {
      return res.status(400).json({ message: 'Assignee is not a member of the project' });
    }
    
    // Update the task assignee
    task.assigneeId = assigneeId;
    await task.save();
    
    // Process automations for assignment
    await processAutomations(task, 'assignment');
    
    res.status(200).json(task);
  } catch (error) {
    console.error('Error assigning task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;