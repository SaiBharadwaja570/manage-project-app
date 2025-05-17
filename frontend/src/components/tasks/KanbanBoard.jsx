import { useDrop } from 'react-dnd';
import TaskCard from './TaskCard';
import { moveTaskStatus } from '../../services/taskService';

const statuses = ['To Do', 'In Progress', 'Done'];

function KanbanBoard({ tasks, projectId, setTasks }) {
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const updatedTask = await moveTaskStatus(taskId, newStatus);
      setTasks(tasks.map(task => 
        task._id === taskId ? updatedTask : task
      ));
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statuses.map(status => (
        <StatusColumn
          key={status}
          status={status}
          tasks={tasks.filter(task => task.status === status)}
          onStatusChange={handleStatusChange}
        />
      ))}
    </div>
  );
}

function StatusColumn({ status, tasks, onStatusChange }) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item) => {
      if (item.status !== status) {
        onStatusChange(item.id, status);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }));

  return (
    <div
      ref={drop}
      className={`p-4 rounded-lg ${isOver ? 'bg-blue-50' : 'bg-gray-50'}`}
    >
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        {status} ({tasks.length})
      </h2>
      <div className="space-y-3">
        {tasks.map(task => (
          <TaskCard key={task._id} task={task} />
        ))}
      </div>
    </div>
  );
}

export default KanbanBoard;