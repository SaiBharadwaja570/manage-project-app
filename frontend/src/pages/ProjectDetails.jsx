import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import KanbanBoard from '../components/tasks/KanbanBoard';
import TaskForm from '../components/tasks/TaskForm';
import { getProject, getTasksByProject } from '../services/api';
import { getTasksByProject as getProjectTasks } from '../services/api';
import Loader from '../components/ui/Loader';

export default function ProjectDetails() {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectData, tasksData] = await Promise.all([
          getProject(id),
          getProjectTasks(id)
        ]);
        setProject(projectData);
        setTasks(tasksData);
      } catch (error) {
        console.error('Error fetching project details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await createTask({ ...taskData, project: id });
      setTasks([...tasks, newTask]);
      setShowTaskForm(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{project?.title}</h1>
        <button
          onClick={() => setShowTaskForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Add Task
        </button>
      </div>

      <KanbanBoard tasks={tasks} projectId={id} setTasks={setTasks} />

      {showTaskForm && (
        <TaskForm
          onSubmit={handleCreateTask}
          onClose={() => setShowTaskForm(false)}
          projectId={id}
        />
      )}
    </div>
  );
}