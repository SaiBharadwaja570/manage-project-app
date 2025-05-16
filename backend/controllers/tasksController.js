import Task from '../models/tasks.model.js';

// Create a task
export const createTask = async (req, res) => {
  try {
    const newTask = await Task.create(req.body);
    // Populate after create
    const populatedTask = await newTask
      .populate('assignee', 'name email')
      .populate('createdBy', 'name email')
      .execPopulate();
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

// Update a task
export const updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.taskId, req.body, { new: true })
      .populate('assignee', 'name email')
      .populate('createdBy', 'name email');
    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: 'Error updating task', error: err.message });
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

// Move task status
export const moveTaskStatus = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.taskId,
      { status: req.body.status },
      { new: true }
    )
    .populate('assignee', 'name email')
    .populate('createdBy', 'name email');
    
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Error moving task status', error: err.message });
  }
};
