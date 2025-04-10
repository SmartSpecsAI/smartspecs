"use client";

import React, { useState } from "react";
import { Project } from "@/smartspecs/app-lib/redux/slices/ProjectsSlice";
import Modal from "@/smartspecs/lib/presentation/components/common/Modal";
import ProjectForm from "@/smartspecs/app-lib/ components/forms/ProjectForm";
import ProjectCard from "@/smartspecs/app/projects/components/ProjectCard";
import { useProjects } from "../../app-lib/hooks/useProjects";
import LoadingSpinner from "@/smartspecs/app-lib/ components/common/LoadingSpinner";

const ProjectsView: React.FC = () => {
  const { projects, loading, error } = useProjects();

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center gap-6 bg-background text-text">
      <h1 className="text-3xl font-extrabold mb-6">Projects</h1>

      {error && (
        <div className="w-full max-w-6xl p-4 mb-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 font-medium text-center">{error}</p>
        </div>
      )}

      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-primary text-background p-3 rounded-lg shadow-md hover:bg-secondary transition"
      >
        Add New Project
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ProjectForm
          onCancel={() => setIsModalOpen(false)}
          onSaveSuccess={() => setIsModalOpen(false)}
        />
      </Modal>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200">
          <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-xl text-gray-600 font-medium">No hay proyectos disponibles</p>
          <p className="text-gray-500 mt-2">Crea un nuevo proyecto para comenzar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-7xl px-4">
          {projects.map((project: Project) => (
            <div className="transform transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
              <ProjectCard key={project.id} project={project} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsView;