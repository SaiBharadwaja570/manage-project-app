import { create } from 'zustand';
import { Automation } from '../types';
import { api } from '../api';

interface AutomationState {
  automations: Automation[];
  loading: boolean;
  error: string | null;
  fetchAutomationsByProject: (projectId: string) => Promise<void>;
  createAutomation: (automation: Omit<Automation, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateAutomation: (id: string, updates: Partial<Automation>) => Promise<void>;
  deleteAutomation: (id: string) => Promise<void>;
}

export const useAutomationStore = create<AutomationState>((set) => ({
  automations: [],
  loading: false,
  error: null,
  
  fetchAutomationsByProject: async (projectId: string) => {
    try {
      set({ loading: true, error: null });
      const response = await api.get(`/projects/${projectId}/automations`);
      set({ automations: response.data, loading: false });
    } catch (error) {
      console.error('Error fetching automations:', error);
      set({ error: 'Failed to fetch automations', loading: false });
    }
  },
  
  createAutomation: async (automation) => {
    try {
      set({ loading: true, error: null });
      const response = await api.post('/automations', automation);
      set(state => ({ 
        automations: [...state.automations, response.data],
        loading: false 
      }));
    } catch (error) {
      console.error('Error creating automation:', error);
      set({ error: 'Failed to create automation', loading: false });
    }
  },
  
  updateAutomation: async (id, updates) => {
    try {
      set({ loading: true, error: null });
      const response = await api.put(`/automations/${id}`, updates);
      
      set(state => ({
        automations: state.automations.map(a => a.id === id ? response.data : a),
        loading: false
      }));
    } catch (error) {
      console.error(`Error updating automation ${id}:`, error);
      set({ error: 'Failed to update automation', loading: false });
    }
  },
  
  deleteAutomation: async (id) => {
    try {
      set({ loading: true, error: null });
      await api.delete(`/automations/${id}`);
      
      set(state => ({
        automations: state.automations.filter(a => a.id !== id),
        loading: false
      }));
    } catch (error) {
      console.error(`Error deleting automation ${id}:`, error);
      set({ error: 'Failed to delete automation', loading: false });
    }
  }
}));