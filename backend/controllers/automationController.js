import Automation from '../models/automation.model.js';

// Create a new automation rule
export const createAutomation = async (req, res) => {
  try {
    const { project, trigger, condition, action } = req.body;
    const createdBy = req.user._id; // assuming user is authenticated

    const automation = await Automation.create({
      project,
      trigger,
      condition,
      action,
      createdBy
    });

    res.status(201).json(automation);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create automation', error });
  }
};

// Get all automations for a project
export const getAutomationsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const automations = await Automation.find({ project: projectId });

    res.status(200).json(automations);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch automations', error });
  }
};

// Delete an automation
export const deleteAutomation = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Automation.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Automation not found' });
    }

    res.status(200).json({ message: 'Automation deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete automation', error });
  }
};
