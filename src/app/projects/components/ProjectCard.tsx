import React from "react";
import Link from "next/link";
import { Project } from "@/smartspecs/app-lib/redux/slices/ProjectsSlice";

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <Link key={project.id} href={`/projects/${project.id}`}>
      <div className="bg-background shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow border border-primary cursor-pointer">
        <h2 className="font-semibold text-xl mb-2">{project.title}</h2>
        <p className="text-sm text-text mb-1">
          <strong>ID:</strong> {project.id}
        </p>
        <p className="text-sm text-text mb-1">
          <strong>Client:</strong> {project.client}
        </p>
        <p className="text-sm text-text mb-1">
          <strong>Description:</strong> {project.description}
        </p>
        <p className="text-sm text-text mb-1">
          <strong>Created At:</strong> {new Date(project.createdAt).toLocaleDateString()}
        </p>
        <p className="text-sm text-text mb-1">
          <strong>Updated At:</strong> {new Date(project.updatedAt).toLocaleDateString()}
        </p>
      </div>
    </Link>
  );
};

export default ProjectCard; 