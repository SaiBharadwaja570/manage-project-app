import React from 'react';
import ProjectCard from '../components/ProjectCard';

const Projects = () => {
  const mockProjects = [{ name: 'Project A' }, { name: 'Project B' }];
  return (
    <div>
      <h2>Projects</h2>
      {mockProjects.map((project, i) => (
        <ProjectCard key={i} project={project} />
      ))}
    </div>
  );
};
export default Projects;