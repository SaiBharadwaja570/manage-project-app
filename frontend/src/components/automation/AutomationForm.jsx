import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useUsers } from '../../hooks/useUser';

const AutomationForm = ({ onSubmit, onCancel, initialData }) => {
  const { projectId } = useParams();
  const { users, loading: usersLoading } = useUsers(projectId);
  const [formData, setFormData] = useState({
    name: '',
    trigger: 'status_changed',
    condition: { from: 'To Do', to: 'In Progress' },
    action: { type: 'update_status', newStatus: 'Done' },
    ...initialData
  });

  const statusOptions = ['To Do', 'In Progress', 'Done'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleConditionChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      condition: { ...prev.condition, [name]: value }
    }));
  };

  const handleActionChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      action: { ...prev.action, [name]: value }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      project: projectId
    });
  };

  // Reset condition when trigger changes
  useEffect(() => {
    if (!initialData) {
      setFormData(prev => {
        let newCondition = {};
        if (prev.trigger === 'status_changed') {
          newCondition = { from: 'To Do', to: 'In Progress' };
        } else if (prev.trigger === 'task_assigned') {
          newCondition = { assignee: users[0]?._id || '' };
        }
        
        return {
          ...prev,
          condition: newCondition
        };
      });
    }
  }, [formData.trigger, users, initialData]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Rule Name (Optional)
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="e.g., Auto-complete workflow"
        />
      </div>

      <div>
        <label htmlFor="trigger" className="block text-sm font-medium text-gray-700">
          Trigger
        </label>
        <select
          id="trigger"
          name="trigger"
          value={formData.trigger}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="status_changed">Status Changed</option>
          <option value="task_assigned">Task Assigned</option>
          <option value="due_date_passed">Due Date Passed</option>
        </select>
      </div>

      {formData.trigger === 'status_changed' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="from" className="block text-sm font-medium text-gray-700">
              From Status
            </label>
            <select
              id="from"
              name="from"
              value={formData.condition.from || ''}
              onChange={handleConditionChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              {statusOptions.map(status => (
                <option key={`from-${status}`} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="to" className="block text-sm font-medium text-gray-700">
              To Status
            </label>
            <select
              id="to"
              name="to"
              value={formData.condition.to || ''}
              onChange={handleConditionChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              {statusOptions.map(status => (
                <option key={`to-${status}`} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {formData.trigger === 'task_assigned' && (
        <div>
          <label htmlFor="assignee" className="block text-sm font-medium text-gray-700">
            Assignee
          </label>
          <select
            id="assignee"
            name="assignee"
            value={formData.condition.assignee || ''}
            onChange={handleConditionChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            disabled={usersLoading}
          >
            {usersLoading ? (
              <option>Loading users...</option>
            ) : (
              users.map(user => (
                <option key={user._id} value={user._id}>
                  {user.name || user.email}
                </option>
              ))
            )}
          </select>
        </div>
      )}

      {formData.trigger === 'due_date_passed' && (
        <div className="text-sm text-gray-500">
          This rule will trigger when a task's due date passes.
        </div>
      )}

      <div>
        <label htmlFor="action-type" className="block text-sm font-medium text-gray-700">
          Action
        </label>
        <select
          id="action-type"
          name="type"
          value={formData.action.type}
          onChange={handleActionChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="update_status">Update Status</option>
          <option value="notify">Send Notification</option>
        </select>
      </div>

      {formData.action.type === 'update_status' && (
        <div>
          <label htmlFor="newStatus" className="block text-sm font-medium text-gray-700">
            New Status
          </label>
          <select
            id="newStatus"
            name="newStatus"
            value={formData.action.newStatus || ''}
            onChange={handleActionChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            {statusOptions.map(status => (
              <option key={`action-${status}`} value={status}>{status}</option>
            ))}
          </select>
        </div>
      )}

      {formData.action.type === 'notify' && (
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Notification Message
          </label>
          <input
            type="text"
            id="message"
            name="message"
            value={formData.action.message || ''}
            onChange={handleActionChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="e.g., Task has been completed!"
            required
          />
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {initialData ? 'Update Rule' : 'Create Rule'}
        </button>
      </div>
    </form>
  );
};

export default AutomationForm;