import api from './api';

export const createTask = async (taskData) => {
  const response = await api.post('/tasks', taskData);
  return response.data;
};

// Fetch all tasks (general)
export const getTasks = async () => {
  const response = await api.get('/tasks');
  return response.data;
};

// Fetch tasks filtered by project
export const getTasksByProject = async (projectId) => {
  const response = await api.get(`/tasks/${projectId}`);
  return response.data;
};

export const updateTask = async (taskId, taskData) => {
  const response = await api.put(`/tasks/${taskId}`, taskData);
  return response.data;
};

export const deleteTask = async (taskId) => {
  const response = await api.delete(`/tasks/${taskId}`);
  return response.data;
};

export const moveTaskStatus = async (taskId, newStatus) => {
  const response = await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
  return response.data;
};