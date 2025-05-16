import Automation from '../models/automation.model.js';
import Project from '../models/project.model.js';

// Helper function to check if user is project member
const isProjectMember = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) throw new Error('Project not found');
  return project.members.some(memberId => memberId.toString() === userId);
};

// Create Automation
export const createAutomation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { project: projectId } = req.body;

    if (!await isProjectMember(projectId, userId)) {
      return res.status(403).json({ message: 'Access denied: Not a project member' });
    }

    const automation = await Automation.create({ ...req.body, createdBy: userId });
    const populatedAutomation = await automation
      .populate('createdBy', 'name email')
      .populate('project', 'title')
      .execPopulate();

    res.status(201).json(populatedAutomation);
  } catch (err) {
    res.status(500).json({ message: 'Error creating automation', error: err.message });
  }
};

// Get Automations by Project
export const getAutomationsByProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const projectId = req.params.projectId;

    if (!await isProjectMember(projectId, userId)) {
      return res.status(403).json({ message: 'Access denied: Not a project member' });
    }

    const automations = await Automation.find({ project: projectId })
      .populate('createdBy', 'name email')
      .populate('project', 'title');
    res.status(200).json(automations);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving automations', error: err.message });
  }
};

// Update Automation
export const updateAutomation = async (req, res) => {
  try {
    const userId = req.user.id;
    const automationId = req.params.id;

    const automation = await Automation.findById(automationId);
    if (!automation) return res.status(404).json({ message: 'Automation not found' });

    // Only creator can update
    if (automation.createdBy.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied: Not creator' });
    }

    Object.assign(automation, req.body);
    await automation.save();

    const populatedAutomation = await automation
      .populate('createdBy', 'name email')
      .populate('project', 'title')
      .execPopulate();

    res.status(200).json(populatedAutomation);
  } catch (err) {
    res.status(500).json({ message: 'Error updating automation', error: err.message });
  }
};

// Delete Automation
export const deleteAutomation = async (req, res) => {
  try {
    const userId = req.user.id;
    const automationId = req.params.id;

    const automation = await Automation.findById(automationId);
    if (!automation) return res.status(404).json({ message: 'Automation not found' });

    // Only creator can delete
    if (automation.createdBy.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied: Not creator' });
    }

    await automation.remove();

    res.status(200).json({ message: 'Automation deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete automation', error: error.message });
  }
};
