import { create } from 'zustand';
import { Project } from '../types';
import { api } from '../api';

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  fetchProjectById: (id: string) => Promise<void>;
  createProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  inviteUserToProject: (projectId: string, email: string) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  currentProject: null,
  loading: false,
  error: null,
  
  fetchProjects: async () => {
    try {
      set({ loading: true, error: null });
      const response = await api.get('/projects');
      set({ projects: response.data, loading: false });
    } catch (error) {
      console.error('Error fetching projects:', error);
      set({ error: 'Failed to fetch projects', loading: false });
    }
  },
  
  fetchProjectById: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const response = await api.get(`/projects/${id}`);
      set({ currentProject: response.data, loading: false });
    } catch (error) {
      console.error(`Error fetching project ${id}:`, error);
      set({ error: 'Failed to fetch project', loading: false });
    }
  },
  
  createProject: async (project) => {
    try {
      set({ loading: true, error: null });
      const response = await api.post('/projects', project);
      set(state => ({ 
        projects: [...state.projects, response.data],
        loading: false 
      }));
    } catch (error) {
      console.error('Error creating project:', error);
      set({ error: 'Failed to create project', loading: false });
    }
  },
  
  updateProject: async (id, updates) => {
    try {
      set({ loading: true, error: null });
      const response = await api.put(`/projects/${id}`, updates);
      
      set(state => ({
        projects: state.projects.map(p => p.id === id ? response.data : p),
        currentProject: state.currentProject?.id === id ? response.data : state.currentProject,
        loading: false
      }));
    } catch (error) {
      console.error(`Error updating project ${id}:`, error);
      set({ error: 'Failed to update project', loading: false });
    }
  },
  
  inviteUserToProject: async (projectId, email) => {
    try {
      set({ loading: true, error: null });
      await api.post(`/projects/${projectId}/invite`, { email });
      
      // Refresh project data to get updated members list
      await get().fetchProjectById(projectId);
      set({ loading: false });
    } catch (error) {
      console.error('Error inviting user:', error);
      set({ error: 'Failed to invite user', loading: false });
    }
  }
}));