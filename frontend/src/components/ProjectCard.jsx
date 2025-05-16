import React from 'react';

const ProjectCard = ({ project }) => {
  return <div className="p-4 shadow-md">{project.name}</div>;
};
export default ProjectCard;