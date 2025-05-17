// src/services/api.js
import axios from "./axios"

// Auth endpoints
export const loginBackend = async (firebaseToken) => {
  try {
    const response = await axios.post('/auth/login', null, {
      headers: { 
        Authorization: `Bearer ${firebaseToken}`,
        'X-Firebase-Auth': true 
      }
    });
    
    if (response.data.token) {
      localStorage.setItem('backendToken', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    console.error('Backend login failed:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await axios.get('/auth/me');
    return response.data.user || response.data;
  } catch (error) {
    console.error('Failed to fetch user info:', error);
    return null;
  }
};

// Project endpoints
export const createProject = async (projectData) => {
  const response = await axios.post('/project', projectData);
  return response.data;
};

export const getProjects = async () => {
  const response = await axios.get('/project');
  return response.data;
};

export const getProject = async (projectId) => {
  const response = await axios.get(`/project/${projectId}`);
  return response.data;
};

export const updateProject = async (projectId, projectData) => {
  const response = await axios.patch(`/project/${projectId}`, projectData);
  return response.data;
};

export const inviteToProject = async (projectId, email) => {
  const response = await axios.post(`/project/${projectId}/invite`, { email });
  return response.data;
};

// Task endpoints
export const createTask = async (taskData) => {
  const response = await axios.post('/tasks', taskData);
  return response.data;
};

export const getTasksByProject = async (projectId) => {
  const response = await axios.get(`/tasks/${projectId}`);
  return response.data;
};

export const updateTask = async (taskId, taskData) => {
  const response = await axios.put(`/tasks/${taskId}`, taskData);
  return response.data;
};

export const deleteTask = async (taskId) => {
  const response = await axios.delete(`/tasks/${taskId}`);
  return response.data;
};

export const moveTaskStatus = async (taskId, newStatus) => {
  const response = await axios.patch(`/tasks/${taskId}/status`, { status: newStatus });
  return response.data;
};

// Automation endpoints
export const createAutomation = async (automationData) => {
  const response = await axios.post('/automation', automationData);
  return response.data;
};

export const getAutomationsByProject = async (projectId) => {
  const response = await axios.get(`/automation/${projectId}`);
  return response.data;
};

export const updateAutomation = async (automationId, automationData) => {
  const response = await axios.put(`/automation/${automationId}`, automationData);
  return response.data;
};

export const deleteAutomation = async (automationId) => {
  const response = await axios.delete(`/automation/${automationId}`);
  return response.data;
};

// Notification endpoints (optional)
export const getNotifications = async () => {
  const response = await axios.get('/notifications');
  return response.data;
};

export const markNotificationAsRead = async (notificationId) => {
  const response = await axios.patch(`/notifications/${notificationId}/read`);
  return response.data;
};

export default {
  // Auth
  loginBackend,
  getCurrentUser,
  
  // Projects
  createProject,
  getProjects,
  getProject,
  updateProject,
  inviteToProject,
  
  // Tasks
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask,
  moveTaskStatus,
  
  // Automation
  createAutomation,
  getAutomationsByProject,
  updateAutomation,
  deleteAutomation,
  
  // Notifications
  getNotifications,
  markNotificationAsRead
};