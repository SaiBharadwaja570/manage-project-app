import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProjects } from '../services/projectService';
import { getTasks } from '../services/taskService';
import ProjectCard from '../components/projects/ProjectCard';
import TaskList from '../components/tasks/TaskList';
import Loader from '../components/ui/Loader';
import EmptyState from '../components/ui/EmptyState';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('projects');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [projectsData, tasksData] = await Promise.all([
          getProjects(),
          getTasks({ limit: 5, sort: '-createdAt' })
        ]);
        setProjects(projectsData.slice(0, 3));
        setRecentTasks(tasksData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loader className="mt-8" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('projects')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'projects'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Projects
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'tasks'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Recent Tasks
          </button>
        </nav>
      </div>

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Recent Projects</h2>
            <Link
              to="/projects"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All →
            </Link>
          </div>

          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No projects yet"
              description="Get started by creating your first project"
              actionText="Create Project"
              actionLink="/projects/new"
            />
          )}
        </div>
      )}

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Recent Tasks</h2>
            <Link
              to="/tasks"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All →
            </Link>
          </div>

          {recentTasks.length > 0 ? (
            <TaskList tasks={recentTasks} showProject={true} />
          ) : (
            <EmptyState
              title="No tasks yet"
              description="Tasks you create will appear here"
              actionText="Create Task"
              actionLink="/tasks/new"
            />
          )}
        </div>
      )}

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
          <h3 className="text-lg font-medium text-gray-900">Projects</h3>
          <p className="mt-2 text-3xl font-bold text-gray-800">
            {projects.length}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Total active projects
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
          <h3 className="text-lg font-medium text-gray-900">Completed Tasks</h3>
          <p className="mt-2 text-3xl font-bold text-gray-800">
            {recentTasks.filter(t => t.status === 'Done').length}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            In the last 30 days
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
          <h3 className="text-lg font-medium text-gray-900">In Progress</h3>
          <p className="mt-2 text-3xl font-bold text-gray-800">
            {recentTasks.filter(t => t.status === 'In Progress').length}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Currently working on
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;