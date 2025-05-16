import { runAutomations } from '../utils/automationRunner.js';
import Task from '../models/tasks.model.js';

// Create a task
export const createTask = async (req, res) => {
  try {
    const newTask = await Task.create(req.body);

    const populatedTask = await newTask
      .populate('assignee', 'name email')
      .populate('createdBy', 'name email')
      .execPopulate();

    // Run automation if assignee is present
    if (populatedTask.assignee) {
      await runAutomations('task_assigned', populatedTask);
    }

    res.status(201).json(populatedTask);
  } catch (err) {
    res.status(500).json({ message: 'Error creating task', error: err.message });
  }
};

// Get tasks by project ID
export const getTasksByProject = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignee', 'name email')
      .populate('createdBy', 'name email');
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving tasks', error: err.message });
  }
};

// Update a task (with automation)
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const oldTaskData = { status: task.status, assignee: task.assignee?.toString() };

    Object.assign(task, req.body);
    await task.save();

    const populatedTask = await task
      .populate('assignee', 'name email')
      .populate('createdBy', 'name email')
      .execPopulate();

    // Check and run automations
    if (req.body.status && req.body.status !== oldTaskData.status) {
      await runAutomations('status_changed', populatedTask, oldTaskData);
    }

    if (req.body.assignee && req.body.assignee !== oldTaskData.assignee) {
      await runAutomations('task_assigned', populatedTask, oldTaskData);
    }

    return res.status(200).json(populatedTask);
  } catch (err) {
    return res.status(500).json({ message: 'Error updating task', error: err.message });
  }
};

// Delete a task
export const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.taskId);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Error deleting task', error: err.message });
  }
};

// Move task status (uses automation too)
export const moveTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const oldTaskData = { status: task.status };

    task.status = req.body.status;
    await task.save();

    const populatedTask = await task
      .populate('assignee', 'name email')
      .populate('createdBy', 'name email')
      .execPopulate();

    if (oldTaskData.status !== req.body.status) {
      await runAutomations('status_changed', populatedTask, oldTaskData);
    }

    res.status(200).json(populatedTask);
  } catch (err) {
    res.status(500).json({ message: 'Error moving task status', error: err.message });
  }
};
