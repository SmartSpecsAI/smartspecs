"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/smartspecs/app-lib/components/modals/Modal";
import { useProjects } from "../../app-lib/hooks/projects/useProjects";
import ProjectsHeader from "./components/ProjectsHeader";
import ErrorState from "./components/ErrorState";
import EmptyState from "./components/EmptyState";
import ProjectsList from "./components/ProjectsList";
import LoadingSpinner from "@/smartspecs/app-lib/components/common/LoadingSpinner";
import ProjectForm from "@/smartspecs/app-lib/components/forms/ProjectForm";
import { useSelector } from "react-redux";
import { RootState } from "@/smartspecs/app-lib/redux/store";
import RequireAuth from "@/smartspecs/app-lib/components/auth/RequireAuth";

const ProjectsView: React.FC = () => {
  const { projects, loading, error } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentUser } = useSelector((state: RootState) => state.users);
  const [isPageLoading, setIsPageLoading] = useState(true);

  // Solo verificar si los datos están cargados
  useEffect(() => {
    if (!loading || error) {
      setIsPageLoading(false);
    }
  }, [loading, error]);


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

export default function ProjectsPage() {
  return (
    <RequireAuth>
      <ProjectsView />
    </RequireAuth>
  );
}