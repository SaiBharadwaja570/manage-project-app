import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Task } from '../../types';
import { useTaskStore } from '../../store/taskStore';
import { Calendar, User } from 'lucide-react';
import { format } from 'date-fns';

interface KanbanBoardProps {
  projectId: string;
  statuses: string[];
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ projectId, statuses, tasks, onTaskClick }) => {
  const { moveTask } = useTaskStore();
  
  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    
    // Dropped outside the list
    if (!destination) {
      return;
    }
    
    // Dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    
    // Move the task to the new status
    await moveTask(draggableId, destination.droppableId);
  };
  
  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };
  
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {statuses.map(status => (
          <div key={status} className="flex-shrink-0 w-72">
            <div className="bg-gray-100 rounded-md shadow p-2">
              <h3 className="font-medium text-gray-900 p-2 mb-2">{status} ({getTasksByStatus(status).length})</h3>
              
              <Droppable droppableId={status}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="min-h-[200px]"
                  >
                    {getTasksByStatus(status).map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => onTaskClick(task.id)}
                            className="bg-white p-3 rounded shadow mb-2 cursor-pointer hover:shadow-md transition-shadow duration-200"
                          >
                            <h4 className="font-medium text-gray-900 mb-1">{task.title}</h4>
                            <p className="text-sm text-gray-500 line-clamp-2 mb-2">{task.description}</p>
                            
                            <div className="flex justify-between items-center text-xs text-gray-500">
                              {task.dueDate && (
                                <div className="flex items-center">
                                  <Calendar size={12} className="mr-1" />
                                  <span>{format(new Date(task.dueDate), 'MMM d')}</span>
                                </div>
                              )}
                              
                              {task.assigneeId && (
                                <div className="flex items-center">
                                  <User size={12} className="mr-1" />
                                  <span>Assigned</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;