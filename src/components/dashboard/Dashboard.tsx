import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProjectStore } from '../../store/projectStore';
import { useAuthStore } from '../../store/authStore';
import { Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const { projects, fetchProjects } = useProjectStore();
  const { user } = useAuthStore();
  
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);
  
  // Placeholder data for dashboard stats
  const stats = [
    { name: 'Total Projects', value: projects.length, icon: <Briefcase size={20} /> },
    { name: 'Tasks Completed', value: 24, icon: <CheckCircle size={20} /> },
    { name: 'Tasks In Progress', value: 12, icon: <Clock size={20} /> },
    { name: 'Overdue Tasks', value: 3, icon: <AlertCircle size={20} /> },
  ];
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back, {user?.name}! Here's what's happening with your projects.
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                  {stat.icon}
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{stat.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Projects</h3>
          </div>
          <ul className="divide-y divide-gray-200">
            {projects.length === 0 ? (
              <li className="px-4 py-4 sm:px-6">
                <p className="text-sm text-gray-500">No projects yet. Create your first project!</p>
              </li>
            ) : (
              projects.slice(0, 5).map((project) => (
                <li key={project.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <Link to={`/projects/${project.id}`} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-indigo-600 truncate">{project.title}</p>
                      <p className="text-sm text-gray-500 truncate">{project.description}</p>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar size={16} className="mr-1" />
                      <span>{format(new Date(project.createdAt), 'MMM d')}</span>
                    </div>
                  </Link>
                </li>
              ))
            )}
          </ul>
          <div className="px-4 py-4 sm:px-6 border-t border-gray-200">
            <Link
              to="/projects"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              View all projects
              <span aria-hidden="true"> &rarr;</span>
            </Link>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="flow-root">
              <ul className="-mb-8">
                {/* Placeholder activity items */}
                {[1, 2, 3, 4].map((item, index) => (
                  <li key={index}>
                    <div className="relative pb-8">
                      {index !== 3 ? (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center ring-8 ring-white">
                            <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              {index === 0 && "Task 'Update documentation' was completed"}
                              {index === 1 && "New project 'Marketing Campaign' was created"}
                              {index === 2 && "Task 'Design homepage' was moved to 'In Progress'"}
                              {index === 3 && "New team member was invited to 'Website Redesign'"}
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            <time dateTime="2023-01-23">{index === 0 ? '1h ago' : index === 1 ? '3h ago' : index === 2 ? '1d ago' : '2d ago'}</time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Import Briefcase icon for the stats
import { Briefcase } from 'lucide-react';

export default Dashboard;