// src/app/(your-segment)/projects/[id]/page.tsx
"use client";

import React, { useState } from "react";

import ProjectForm from "@/smartspecs/app-lib/components/forms/ProjectForm";
import MeetingList from "@/smartspecs/app-lib/components/lists/MeetingList";
import ProjectInfo from "./components/ProjectInfo";
import Modal from "@/smartspecs/app-lib/components/modals/Modal";
import LoadingSpinner from "@/smartspecs/app-lib/components/common/LoadingSpinner";
import ErrorMessage from "@/smartspecs/app-lib/components/messages/ErrorMessage";
import SuccessMessage from "@/smartspecs/app-lib/components/messages/SuccessMessage";
import MeetingForm from "@/smartspecs/app-lib/components/forms/MeetingForm";
import RequirementList from "@/smartspecs/app-lib/components/lists/requirements-list/RequirementList";
import { useProjectData } from "@/smartspecs/app-lib/hooks/projects/useProjectData";
import { useProjectDetail } from "@/smartspecs/app-lib/hooks/projects/useProjectDetail";
import { Requirement } from "@/smartspecs/app-lib/interfaces/requirement";

const ProjectDetail: React.FC = () => {
  // Este hook se encarga de cargar datos: proyecto, reuniones, requerimientos
  const {
    project,
    projectMeetings,
    requirements,
    loading,
    error,
    meetingsError,
    requirementsError,
  } = useProjectData();

  // Este hook maneja los estados de UI: editar, modales, mensajes de éxito, etc.
  const {
    isEditing,
    deleteSuccessMsg,
    updateSuccessMsg,
    handleEdit,
    handleCancelEdit,
    handleSaveSuccess,
    showMeetingModal,
    setShowMeetingModal,
    handleDeleteAllMeetings,
    isDeletingMeetings,
  } = useProjectDetail(project);

  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [isMeetingProcessing, setIsMeetingProcessing] = useState(false);

  const handleCopyRequirements = () => {
    const requirementsText = requirements.map(req => {
      return `Title: ${req.title}\nDescription: ${req.description}\nStatus: ${req.status}\nResponsible: ${req.responsible || 'Not assigned'}\n\n`;
    }).join('---\n');

    navigator.clipboard.writeText(requirementsText)
      .then(() => {
        setShowCopySuccess(true);
        setTimeout(() => setShowCopySuccess(false), 2000); // Ocultar después de 2 segundos
      })
      .catch(err => {
        console.error('Error al copiar al portapapeles:', err);
        alert('Error al copiar los requerimientos');
      });
  };

  const handleMeetingProcessingStart = () => {
    setShowMeetingModal(false);
    setIsMeetingProcessing(true);
  };

  const handleMeetingSaveSuccess = () => {
    setIsMeetingProcessing(false);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (isMeetingProcessing) {
    return <LoadingSpinner title="Processing meeting..." subtitle="This may take a moment" />;
  }

  if (error || meetingsError || requirementsError) {
    return (
      <ErrorMessage
        message={(error || meetingsError || requirementsError) || "An error occurred"}
      />
    );
  }

  // Si no hay proyecto y se eliminó con éxito, mostramos mensaje de éxito
  if (!project) {
    if (deleteSuccessMsg) {
      return (
        <div className="p-4">
          <SuccessMessage message={deleteSuccessMsg} />
        </div>
      );
    }
    return <ErrorMessage message="Project not found" />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center gap-4 bg-background text-text p-4">
      {deleteSuccessMsg && <SuccessMessage message={deleteSuccessMsg} />}
      {updateSuccessMsg && <SuccessMessage message={updateSuccessMsg} />}

      {isEditing ? (
        <ProjectForm
          project={project}
          onCancel={handleCancelEdit}
          onSaveSuccess={handleSaveSuccess}
        />
      ) : (
        <div className="w-full">
          <ProjectInfo project={project} />
          <div className="flex justify-end gap-4 mt-4">
            <button
              className="bg-primary text-white px-4 py-2 rounded"
              onClick={handleEdit}
            >
              Edit
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={() => setShowMeetingModal(true)}
            >
              Add Meeting
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={handleDeleteAllMeetings}
              disabled={isDeletingMeetings}
            >
              {isDeletingMeetings ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white inline-block mr-2"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="white"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="white"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8z"
                    />
                  </svg>
                  Deleting...
                </>
              ) : (
                "Delete Meetings"
              )}
            </button>
          </div>
        </div>
      )}

      <Modal isOpen={showMeetingModal} onClose={() => setShowMeetingModal(false)}>
        <MeetingForm
          onCancel={() => setShowMeetingModal(false)}
          onSaveSuccess={handleMeetingSaveSuccess}
          onProcessingStart={handleMeetingProcessingStart}
          projectId={project.id}
          projectTitle={project.title}
          projectDescription={project.description}
          projectClient={project.client}
          requirementsList={requirements as Requirement[]}
        />
      </Modal>

      <div className="bg-background p-6 rounded-xl shadow-md w-full mt-8">
        <h2 className="text-2xl font-bold mb-4">Meetings</h2>
        <MeetingList meetings={projectMeetings} />
      </div>

      <div className="bg-background p-6 rounded-xl shadow-md w-full mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Requirements</h2>
          <div className="flex items-center gap-2">
            {showCopySuccess && (
              <span className="text-green-500 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Copiado
              </span>
            )}
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              onClick={handleCopyRequirements}
            >
              Copy Requirements
            </button>
          </div>
        </div>
        <RequirementList requirements={requirements} />
      </div>
    </div>
  );
};

export default ProjectDetail;