import React from 'react';
import ProjectCard from "@/smartspecs/app/projects/components/ProjectCard";
import { Project } from '@/smartspecs/app-lib/interfaces/project';

interface ProjectsListProps {
  projects: Project[];
}

const ProjectsList: React.FC<ProjectsListProps> = ({ projects }) => {
  return (
    <div className="w-full max-w-7xl px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project: Project) => (
          <div key={project.id} className="transform transition-all duration-300 hover:-translate-y-1">
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsList; 