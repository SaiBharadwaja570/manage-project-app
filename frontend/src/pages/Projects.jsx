import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProjects, createProject } from '../services/projectService';
import ProjectCard from '../components/projects/ProjectCard';
import ProjectForm from '../components/projects/ProjectForm';
import Modal from '../components/ui/Modal';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleCreateProject = async (projectData) => {
    try {
      const newProject = await createProject(projectData);
      setProjects([...projects, newProject]);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  if (loading) return <div className="text-center py-8">Loading projects...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Projects</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <Link to={`/projects/${project._id}`} key={project._id}>
            <ProjectCard project={project} />
          </Link>
        ))}
      </div>

      {showForm && (
        <Modal onClose={() => setShowForm(false)}>
          <ProjectForm 
            onSubmit={handleCreateProject} 
            onCancel={() => setShowForm(false)}
          />
        </Modal>
      )}
    </div>
  );
}