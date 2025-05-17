import React from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';

const AutomationCard = ({ automation, onDelete }) => {
  // Helper to format trigger display
  const formatTrigger = (trigger) => {
    const triggers = {
      'status_changed': 'Status Changed',
      'task_assigned': 'Task Assigned',
      'due_date_passed': 'Due Date Passed'
    };
    return triggers[trigger] || trigger;
  };

  // Helper to format condition display
  const formatCondition = (trigger, condition) => {
    switch (trigger) {
      case 'status_changed':
        return `When status changes from "${condition.from}" to "${condition.to}"`;
      case 'task_assigned':
        return `When task is assigned to ${condition.assigneeName || 'a user'}`;
      case 'due_date_passed':
        return 'When due date passes';
      default:
        return JSON.stringify(condition);
    }
  };

  // Helper to format action display
  const formatAction = (action) => {
    switch (action.type) {
      case 'update_status':
        return `Update status to "${action.newStatus}"`;
      case 'notify':
        return `Send notification: "${action.message}"`;
      default:
        return JSON.stringify(action);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-blue-500">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {automation.name || 'Untitled Rule'}
          </h3>
          <button
            onClick={() => onDelete(automation._id)}
            className="text-red-500 hover:text-red-700 transition-colors"
            aria-label="Delete automation"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-2 mt-2">
          <div className="flex items-start">
            <span className="text-sm font-medium text-gray-500 w-24">Trigger:</span>
            <span className="text-sm text-gray-800 flex-1">
              {formatTrigger(automation.trigger)}
            </span>
          </div>

          <div className="flex items-start">
            <span className="text-sm font-medium text-gray-500 w-24">Condition:</span>
            <span className="text-sm text-gray-800 flex-1">
              {formatCondition(automation.trigger, automation.condition)}
            </span>
          </div>

          <div className="flex items-start">
            <span className="text-sm font-medium text-gray-500 w-24">Action:</span>
            <span className="text-sm text-gray-800 flex-1">
              {formatAction(automation.action)}
            </span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
          Created on {new Date(automation.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default AutomationCard;