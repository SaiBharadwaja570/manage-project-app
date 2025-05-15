import Project from '../models/project.model.js';
import User from '../models/user.model.js';

export const createProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    const ownerId = req.user.id;

    const project = new Project({
      title,
      description,
      owner: ownerId,
      members: [ownerId],
    });

    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getProjects = async (req, res) => {
  try {
    const userId = req.user.id;
    const projects = await Project.find({ members: userId });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const inviteUser = async (req, res) => {
  try {
    const projectId = req.params.id;
    const { email } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Only owner can invite' });
    }

    const userToInvite = await User.findOne({ email });
    if (!userToInvite) return res.status(404).json({ error: 'User not found' });

    if (!project.members.includes(userToInvite._id)) {
      project.members.push(userToInvite._id);
      await project.save();
    }

    res.json({ message: 'User invited successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const { title, description } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    if (!project.members.includes(req.user.id)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (title) project.title = title;
    if (description) project.description = description;

    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
