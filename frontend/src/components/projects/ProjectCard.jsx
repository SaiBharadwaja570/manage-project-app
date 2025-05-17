export default function ProjectCard({ project }) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{project.title}</h3>
          <p className="text-gray-600 mb-4">{project.description}</p>
          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-2">Tasks: {project.taskCount || 0}</span>
            <span>Members: {project.memberCount || 1}</span>
          </div>
        </div>
      </div>
    );
  }