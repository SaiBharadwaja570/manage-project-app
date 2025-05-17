import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProjectStore } from '../../store/projectStore';
import { useTaskStore } from '../../store/taskStore';
import { useAutomationStore } from '../../store/automationStore';
import KanbanBoard from '../tasks/KanbanBoard';
import TaskDetailModal from '../tasks/TaskDetailModal';
import CreateTaskModal from '../tasks/CreateTaskModal';
import InviteUserModal from './InviteUserModal';
import { Plus, Users, Zap } from 'lucide-react';
import AutomationList from '../automations/AutomationList';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentProject, loading: projectLoading, error: projectError, fetchProjectById } = useProjectStore();
  const { tasks, loading: tasksLoading, fetchTasksByProject } = useTaskStore();
  const { fetchAutomationsByProject } = useAutomationStore();
  
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'tasks' | 'automations'>('tasks');
  
  useEffect(() => {
    if (id) {
      fetchProjectById(id);
      fetchTasksByProject(id);
      fetchAutomationsByProject(id);
    }
  }, [id, fetchProjectById, fetchTasksByProject, fetchAutomationsByProject]);
  
  if (projectLoading || tasksLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  if (projectError || !currentProject) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading project</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{projectError || 'Project not found'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  const selectedTask = tasks.find(task => task.id === selectedTaskId) || null;
  
  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{currentProject.title}</h1>
            <p className="mt-1 text-sm text-gray-500">{currentProject.description}</p>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Users size={16} className="mr-2" />
              Invite
            </button>
            
            <button
              onClick={() => setIsCreateTaskModalOpen(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus size={16} className="mr-2" />
              Add Task
            </button>
          </div>
        </div>
        
        <div className="mt-4 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`${
                activeTab === 'tasks'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Tasks
            </button>
            <button
              onClick={() => setActiveTab('automations')}
              className={`${
                activeTab === 'automations'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Zap size={16} className="mr-2" />
              Automations
            </button>
          </nav>
        </div>
      </div>
      
      {activeTab === 'tasks' ? (
        <KanbanBoard 
          projectId={currentProject.id}
          statuses={currentProject.statuses}
          tasks={tasks}
          onTaskClick={(taskId) => setSelectedTaskId(taskId)}
        />
      ) : (
        <AutomationList projectId={currentProject.id} />
      )}
      
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          isOpen={!!selectedTaskId}
          onClose={() => setSelectedTaskId(null)}
        />
      )}
      
      <CreateTaskModal
        projectId={currentProject.id}
        statuses={currentProject.statuses}
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
      />
      
      <InviteUserModal
        projectId={currentProject.id}
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />
    </div>
  );
};

export default ProjectDetail;