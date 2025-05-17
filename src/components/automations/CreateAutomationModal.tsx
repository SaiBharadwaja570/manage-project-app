import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useAutomationStore } from '../../store/automationStore';
import { useProjectStore } from '../../store/projectStore';

interface CreateAutomationModalProps {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
  automationId?: string | null;
  onEditComplete?: () => void;
}

const CreateAutomationModal: React.FC<CreateAutomationModalProps> = ({ 
  projectId, 
  isOpen, 
  onClose,
  automationId,
  onEditComplete
}) => {
  const { automations, createAutomation, updateAutomation } = useAutomationStore();
  const { currentProject } = useProjectStore();
  
  const [name, setName] = useState('');
  const [triggerType, setTriggerType] = useState<'status_change' | 'assignment' | 'due_date'>('status_change');
  const [triggerStatus, setTriggerStatus] = useState('');
  const [actionType, setActionType] = useState<'change_status' | 'assign_badge' | 'send_notification'>('change_status');
  const [actionStatus, setActionStatus] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [actionBadge, setActionBadge] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (automationId && isOpen) {
      const automation = automations.find(a => a.id === automationId);
      if (automation) {
        setName(automation.name);
        setTriggerType(automation.trigger.type);
        
        if (automation.trigger.type === 'status_change') {
          setTriggerStatus(automation.trigger.condition.status);
        }
        
        setActionType(automation.action.type);
        
        if (automation.action.type === 'change_status') {
          setActionStatus(automation.action.data.status);
        } else if (automation.action.type === 'send_notification') {
          setActionMessage(automation.action.data.message);
        } else if (automation.action.type === 'assign_badge') {
          setActionBadge(automation.action.data.badgeName);
        }
      }
    } else {
      // Reset form for new automation
      setName('');
      setTriggerType('status_change');
      setTriggerStatus(currentProject?.statuses[0] || '');
      setActionType('change_status');
      setActionStatus(currentProject?.statuses[0] || '');
      setActionMessage('');
      setActionBadge('');
    }
  }, [automationId, isOpen, automations, currentProject]);
  
  if (!isOpen || !currentProject) return null;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    try {
      const automationData = {
        projectId,
        name,
        trigger: {
          type: triggerType,
          condition: triggerType === 'status_change' 
            ? { status: triggerStatus } 
            : triggerType === 'assignment' 
              ? { userId: null } 
              : {}
        },
        action: {
          type: actionType,
          data: actionType === 'change_status' 
            ? { status: actionStatus } 
            : actionType === 'send_notification' 
              ? { message: actionMessage } 
              : { badgeName: actionBadge }
        }
      };
      
      if (automationId) {
        await updateAutomation(automationId, automationData);
        if (onEditComplete) onEditComplete();
      } else {
        await createAutomation(automationData);
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving automation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              {automationId ? 'Edit Automation' : 'Create New Automation'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="px-4 py-3 sm:px-6">
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Automation Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="E.g., Move completed tasks"
                />
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Trigger (When)</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="trigger-status"
                      name="trigger-type"
                      type="radio"
                      checked={triggerType === 'status_change'}
                      onChange={() => setTriggerType('status_change')}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <label htmlFor="trigger-status" className="ml-2 block text-sm text-gray-700">
                      Task status changes to
                    </label>
                    {triggerType === 'status_change' && (
                      <select
                        value={triggerStatus}
                        onChange={(e) => setTriggerStatus(e.target.value)}
                        className="ml-2 block border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        {currentProject.statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="trigger-assignment"
                      name="trigger-type"
                      type="radio"
                      checked={triggerType === 'assignment'}
                      onChange={() => setTriggerType('assignment')}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <label htmlFor="trigger-assignment" className="ml-2 block text-sm text-gray-700">
                      Task is assigned to someone
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="trigger-due-date"
                      name="trigger-type"
                      type="radio"
                      checked={triggerType === 'due_date'}
                      onChange={() => setTriggerType('due_date')}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <label htmlFor="trigger-due-date" className="ml-2 block text-sm text-gray-700">
                      Task due date passes
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Action (Then)</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="action-status"
                      name="action-type"
                      type="radio"
                      checked={actionType === 'change_status'}
                      onChange={() => setActionType('change_status')}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <label htmlFor="action-status" className="ml-2 block text-sm text-gray-700">
                      Move task to
                    </label>
                    {actionType === 'change_status' && (
                      <select
                        value={actionStatus}
                        onChange={(e) => setActionStatus(e.target.value)}
                        className="ml-2 block border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        {currentProject.statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="action-badge"
                      name="action-type"
                      type="radio"
                      checked={actionType === 'assign_badge'}
                      onChange={() => setActionType('assign_badge')}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <label htmlFor="action-badge" className="ml-2 block text-sm text-gray-700">
                      Assign badge
                    </label>
                    {actionType === 'assign_badge' && (
                      <input
                        type="text"
                        value={actionBadge}
                        onChange={(e) => setActionBadge(e.target.value)}
                        className="ml-2 block border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Badge name"
                      />
                    )}
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="action-notification"
                      name="action-type"
                      type="radio"
                      checked={actionType === 'send_notification'}
                      onChange={() => setActionType('send_notification')}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <label htmlFor="action-notification" className="ml-2 block text-sm text-gray-700">
                      Send notification
                    </label>
                  </div>
                  
                  {actionType === 'send_notification' && (
                    <div className="ml-6 mt-2">
                      <input
                        type="text"
                        value={actionMessage}
                        onChange={(e) => setActionMessage(e.target.value)}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Notification message"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                {isSubmitting ? 'Saving...' : (automationId ? 'Update Automation' : 'Create Automation')}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAutomationModal;