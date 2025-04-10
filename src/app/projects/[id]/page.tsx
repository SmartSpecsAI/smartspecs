"use client";

import React from "react";
import { useProjectDetail } from "../../../app-lib/hooks/useProjectDetail";
import ProjectForm from "../../../app-lib/ components/forms/ProjectForm";
import MeetingList from "../../../app-lib/ components/lists/MeetingList";
import ProjectInfo from "./components/ProjectInfo";
import Modal from "@/smartspecs/app-lib/ components/modals/Modal";
import LoadingSpinner from "@/smartspecs/app-lib/ components/common/LoadingSpinner";
import ErrorMessage from "@/smartspecs/app-lib/ components/messages/ErrorMessage";
import SuccessMessage from "@/smartspecs/app-lib/ components/messages/SuccessMessage";
import { Requirement } from "@/smartspecs/app-lib/redux/slices/RequirementsSlice";
import MeetingForm from "@/smartspecs/app-lib/ components/forms/MeetingForm";
import RequirementList from "@/smartspecs/app-lib/ components/lists/requirements-list/RequirementList";

const ProjectDetail: React.FC = () => {
  const {
    isEditing,
    handleEdit,
    deleteSuccessMsg,
    updateSuccessMsg,
    project,
    projectMeetings,
    requirements,
    loading,
    error,
    meetingsError,
    requirementsError,
    handleCancelEdit,
    handleSaveSuccess,
    setShowMeetingModal,
    showMeetingModal,
    handleDeleteAllMeetings,
    isDeletingMeetings,
  } = useProjectDetail();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || meetingsError || requirementsError) {
    return <ErrorMessage message={(error || meetingsError || requirementsError) || 'Ocurrió un error'} />;
  }

  if (!project) {
    if (deleteSuccessMsg) {
      return (
        <div className="p-4">
          <SuccessMessage message={deleteSuccessMsg} />
        </div>
      );
    }
    return <ErrorMessage message="Proyecto no encontrado" />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center gap-4 bg-background text-text p-4">
      {deleteSuccessMsg && <SuccessMessage message={deleteSuccessMsg} />}
      {updateSuccessMsg && <SuccessMessage message={updateSuccessMsg} />}

      {isEditing ? (
        <ProjectForm project={project} onCancel={handleCancelEdit} onSaveSuccess={handleSaveSuccess} />
      ) : (
        <div className="w-full">
          <ProjectInfo project={project} />
          <div className="flex justify-end gap-4 mt-4">
            <button
              className="bg-primary text-white px-4 py-2 rounded"
              onClick={handleEdit}
            >
              Editar
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={() => setShowMeetingModal(true)}
            >
              Agregar Reunión
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={handleDeleteAllMeetings}
              disabled={isDeletingMeetings}
            >
              {isDeletingMeetings ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white inline-block mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8z" />
                  </svg>
                  Eliminando...
                </>
              ) : (
                "Eliminar Reuniones"
              )}
            </button>
          </div>
        </div>
      )}

      <Modal isOpen={showMeetingModal} onClose={() => setShowMeetingModal(false)}>
        <MeetingForm
          onCancel={() => setShowMeetingModal(false)}
          onSaveSuccess={() => setShowMeetingModal(false)}
          projectId={project.id}
          projectTitle={project.title}
          projectDescription={project.description}
          projectClient={project.client}
          requirementsList={requirements as Requirement[]}
        />
      </Modal>

      <div className="bg-background p-6 rounded-xl shadow-md w-full mt-8">
        <h2 className="text-2xl font-bold mb-4">Reuniones</h2>
        <MeetingList meetings={projectMeetings} />
      </div>

      <div className="bg-background p-6 rounded-xl shadow-md w-full mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Requerimientos</h2>
        </div>
        <RequirementList requirements={requirements} />
      </div>
    </div>
  );
};

export default ProjectDetail;