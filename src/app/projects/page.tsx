"use client";

import React, { useState } from "react";
import { Project } from "@/smartspecs/lib/presentation/redux/slices/ProjectsSlice";
import Modal from "@/smartspecs/lib/presentation/components/common/Modal";
import ProjectForm from "@/smartspecs/app/projects/components/ProjectForm";
import ProjectCard from "@/smartspecs/app/projects/components/ProjectCard";
import { useProjects } from "./hooks/useProjects";

const ProjectsView: React.FC = () => {
  const { projects, loading, error } = useProjects();

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading) {
    return <p className="text-center mt-5">Loading projects...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center gap-6 bg-background text-text">
      <h1 className="text-3xl font-extrabold mb-6">Projects</h1>
      {error && <p className="text-danger">{error}</p>}

      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-primary text-background p-3 rounded-lg shadow-md hover:bg-secondary transition"
      >
        Add New Project
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ProjectForm onClose={() => setIsModalOpen(false)} />
      </Modal>

      {projects.length === 0 ? (
        <p>No hay proyectos disponibles</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl">
          {projects.map((project: Project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsView;