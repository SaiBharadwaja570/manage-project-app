import { create } from 'zustand';
import { Task } from '../types';
import { api } from '../api';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasksByProject: (projectId: string) => Promise<void>;
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  moveTask: (taskId: string, newStatus: string) => Promise<void>;
  assignTask: (taskId: string, assigneeId: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  loading: false,
  error: null,
  
  fetchTasksByProject: async (projectId: string) => {
    try {
      set({ loading: true, error: null });
      const response = await api.get(`/projects/${projectId}/tasks`);
      set({ tasks: response.data, loading: false });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      set({ error: 'Failed to fetch tasks', loading: false });
    }
  },
  
  createTask: async (task) => {
    try {
      set({ loading: true, error: null });
      const response = await api.post('/tasks', task);
      set(state => ({ 
        tasks: [...state.tasks, response.data],
        loading: false 
      }));
    } catch (error) {
      console.error('Error creating task:', error);
      set({ error: 'Failed to create task', loading: false });
    }
  },
  
  updateTask: async (id, updates) => {
    try {
      set({ loading: true, error: null });
      const response = await api.put(`/tasks/${id}`, updates);
      
      set(state => ({
        tasks: state.tasks.map(t => t.id === id ? response.data : t),
        loading: false
      }));
    } catch (error) {
      console.error(`Error updating task ${id}:`, error);
      set({ error: 'Failed to update task', loading: false });
    }
  },
  
  deleteTask: async (id) => {
    try {
      set({ loading: true, error: null });
      await api.delete(`/tasks/${id}`);
      
      set(state => ({
        tasks: state.tasks.filter(t => t.id !== id),
        loading: false
      }));
    } catch (error) {
      console.error(`Error deleting task ${id}:`, error);
      set({ error: 'Failed to delete task', loading: false });
    }
  },
  
  moveTask: async (taskId, newStatus) => {
    try {
      set({ loading: true, error: null });
      const response = await api.put(`/tasks/${taskId}/status`, { status: newStatus });
      
      set(state => ({
        tasks: state.tasks.map(t => t.id === taskId ? response.data : t),
        loading: false
      }));
    } catch (error) {
      console.error(`Error moving task ${taskId}:`, error);
      set({ error: 'Failed to move task', loading: false });
    }
  },
  
  assignTask: async (taskId, assigneeId) => {
    try {
      set({ loading: true, error: null });
      const response = await api.put(`/tasks/${taskId}/assign`, { assigneeId });
      
      set(state => ({
        tasks: state.tasks.map(t => t.id === taskId ? response.data : t),
        loading: false
      }));
    } catch (error) {
      console.error(`Error assigning task ${taskId}:`, error);
      set({ error: 'Failed to assign task', loading: false });
    }
  }
}));