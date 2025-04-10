import React from 'react';

interface ProjectsHeaderProps {
  onAddProject: () => void;
}

const ProjectsHeader: React.FC<ProjectsHeaderProps> = ({ onAddProject }) => {
  return (
    <div className="w-full max-w-7xl px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold">
            Projects
          </h1>
          <p className="text-text/70 mt-2">Manage and organize your projects</p>
        </div>
        <button
          onClick={onAddProject}
          className="flex items-center gap-2 bg-primary text-background px-6 py-3 rounded-lg shadow-md hover:bg-secondary transition-all duration-300 transform hover:scale-105"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add New Project
        </button>
      </div>
    </div>
  );
};

export default ProjectsHeader; 