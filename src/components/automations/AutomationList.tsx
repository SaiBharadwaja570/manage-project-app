import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useAutomationStore } from '../../store/automationStore';
import CreateAutomationModal from './CreateAutomationModal';

interface AutomationListProps {
  projectId: string;
}

const AutomationList: React.FC<AutomationListProps> = ({ projectId }) => {
  const { automations, deleteAutomation } = useAutomationStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingAutomation, setEditingAutomation] = useState<string | null>(null);
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this automation?')) {
      await deleteAutomation(id);
    }
  };
  
  const getTriggerDescription = (automation: any) => {
    switch (automation.trigger.type) {
      case 'status_change':
        return `When a task is moved to "${automation.trigger.condition.status}"`;
      case 'assignment':
        return `When a task is assigned to ${automation.trigger.condition.userId ? 'a specific user' : 'anyone'}`;
      case 'due_date':
        return 'When a task due date passes';
      default:
        return 'Unknown trigger';
    }
  };
  
  const getActionDescription = (automation: any) => {
    switch (automation.action.type) {
      case 'change_status':
        return `Move task to "${automation.action.data.status}"`;
      case 'assign_badge':
        return `Assign "${automation.action.data.badgeName}" badge`;
      case 'send_notification':
        return `Send notification: "${automation.action.data.message}"`;
      default:
        return 'Unknown action';
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Workflow Automations</h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus size={16} className="mr-2" />
          New Automation
        </button>
      </div>
      
      {automations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No automations</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new automation rule.</p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus size={16} className="-ml-1 mr-2" />
              New Automation
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {automations.map((automation) => (
              <li key={automation.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-indigo-600">{automation.name}</h4>
                        <div className="mt-1">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">If:</span> {getTriggerDescription(automation)}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Then:</span> {getActionDescription(automation)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingAutomation(automation.id)}
                        className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(automation.id)}
                        className="p-1 rounded-full text-gray-400 hover:text-red-500 focus:outline-none"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <CreateAutomationModal
        projectId={projectId}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        automationId={editingAutomation}
        onEditComplete={() => setEditingAutomation(null)}
      />
    </div>
  );
};

export default AutomationList;