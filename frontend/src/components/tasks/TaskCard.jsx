import React from 'react';
import { useDrag } from 'react-dnd';
import { formatDistanceToNow } from 'date-fns';
import { ClockIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const TaskCard = ({ task }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'task',
    item: { id: task._id, status: task.status },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }));

  const statusColors = {
    'To Do': 'bg-blue-100 text-blue-800',
    'In Progress': 'bg-yellow-100 text-yellow-800',
    'Done': 'bg-green-100 text-green-800'
  };

  return (
    <div
      ref={drag}
      className={`task-card mb-3 p-4 rounded-lg shadow-sm border-l-4 ${
        isDragging ? 'opacity-50' : 'opacity-100'
      } ${
        statusColors[task.status] || 'bg-gray-100'
      }`}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-gray-900">{task.title}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[task.status]}`}>
          {task.status}
        </span>
      </div>

      {task.description && (
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-2">
          {task.dueDate && (
            <>
              <ClockIcon className="h-4 w-4" />
              <span>
                {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
              </span>
            </>
          )}
        </div>

        {task.assignee && (
          <div className="flex items-center">
            <UserCircleIcon className="h-4 w-4 mr-1" />
            <span className="truncate max-w-[80px]">
              {task.assignee.name || task.assignee.email}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;