import React from 'react';
import TaskItem from '../components/TaskItem';

const Tasks = () => {
  const mockTasks = [{ title: 'Task 1' }, { title: 'Task 2' }];
  return (
    <ul>
      {mockTasks.map((task, i) => (
        <TaskItem key={i} task={task} />
      ))}
    </ul>
  );
};
export default Tasks;