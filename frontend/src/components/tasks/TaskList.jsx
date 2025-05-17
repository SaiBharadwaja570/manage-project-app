import React from 'react';
import { Link } from 'react-router-dom';
import { ClockIcon, CheckCircleIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const TaskList = ({ tasks, showProject = false }) => {
  const statusIcons = {
    'To Do': <ClockIcon className="h-4 w-4 text-blue-500" />,
    'In Progress': <div className="h-4 w-4 rounded-full bg-yellow-500 animate-pulse" />,
    'Done': <CheckCircleIcon className="h-4 w-4 text-green-500" />
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {tasks.map((task) => (
          <li key={task._id} className="hover:bg-gray-50 transition-colors">
            <Link to={`/tasks/${task._id}`} className="block px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {statusIcons[task.status] || statusIcons['To Do']}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {task.title}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      {showProject && task.project && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {task.project.title}
                        </span>
                      )}
                      {task.dueDate && (
                        <span className="inline-flex items-center text-xs text-gray-500">
                          <ClockIcon className="h-3 w-3 mr-1" />
                          Due {formatDate(task.dueDate)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {task.assignee && (
                    <div className="flex items-center text-xs text-gray-500">
                      <UserCircleIcon className="h-4 w-4 mr-1" />
                      <span className="truncate max-w-[80px]">
                        {task.assignee.name || task.assignee.email.split('@')[0]}
                      </span>
                    </div>
                  )}
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      {tasks.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No tasks found
        </div>
      )}
    </div>
  );
};

export default TaskList;