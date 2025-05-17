import api from './api';

export const createAutomation = async (automationData) => {
  const response = await api.post('/automations', automationData);
  return response.data;
};

export const getAutomationsByProject = async (projectId) => {
  const response = await api.get(`/automations/${projectId}`);
  return response.data;
};

export const deleteAutomation = async (automationId) => {
  const response = await api.delete(`/automations/${automationId}`);
  return response.data;
};