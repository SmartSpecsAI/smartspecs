"use client";

import React, { useState } from "react";
import Modal from "@/smartspecs/lib/presentation/components/common/Modal";
import { useProjects } from "../../app-lib/hooks/useProjects";
import ProjectsHeader from "./components/ProjectsHeader";
import ErrorState from "./components/ErrorState";
import EmptyState from "./components/EmptyState";
import ProjectsList from "./components/ProjectsList";
import LoadingSpinner from "@/smartspecs/app-lib/ components/common/LoadingSpinner";
import ProjectForm from "@/smartspecs/app-lib/ components/forms/ProjectForm";

const ProjectsView: React.FC = () => {
  const { projects, loading, error } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center gap-6 bg-background text-text">
      <ProjectsHeader onAddProject={() => setIsModalOpen(true)} />

      {error && <ErrorState error={error} />}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ProjectForm
          onCancel={() => setIsModalOpen(false)}
          onSaveSuccess={() => setIsModalOpen(false)}
        />
      </Modal>

      {projects.length === 0 ? (
        <EmptyState />
      ) : (
        <ProjectsList projects={projects} />
      )}
    </div>
  );
};

export default ProjectsView;