"use client";

import React from "react";
import { useProjectDetail } from "./hooks/useProjectDetail";
import ProjectForm from "./components/ProjectForm";
import MeetingList from "./components/MeetingList";
import RequirementList from "./components/RequirementList";
import ProjectInfo from "./components/ProjectInfo";
import CreateMeetingModal from "./components/CreateMeetingModal";

const ProjectDetail: React.FC = () => {
  const {
    isEditing,
    deleteSuccessMsg,
    updateSuccessMsg,
    project,
    projectMeetings,
    requirements,
    loading,
    meetingsLoading,
    requirementsLoading,
    error,
    meetingsError,
    requirementsError,
    handleConfirmDelete,
    handleEdit,
    handleCancelEdit,
    handleSaveSuccess,
    setShowMeetingModal,
    showMeetingModal,
    handleDeleteAllMeetings,
    isDeletingMeetings,
  } = useProjectDetail();

  console.log(requirements);

  if (loading || meetingsLoading || requirementsLoading) {
    return <p className="text-center mt-5">Cargando datos...</p>;
  }

  if (error || meetingsError || requirementsError) {
    return (
      <p className="text-center mt-5 text-red-500">
        {error || meetingsError || requirementsError}
      </p>
    );
  }

  if (!project) {
    if (deleteSuccessMsg) {
      return (
        <div className="p-4">
          <p className="text-green-600 font-bold">{deleteSuccessMsg}</p>
        </div>
      );
    }
    return <p className="text-center mt-5">Proyecto no encontrado</p>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center gap-4 bg-background text-text p-4">
      {deleteSuccessMsg && (
        <p className="text-green-600 font-bold">{deleteSuccessMsg}</p>
      )}
      {updateSuccessMsg && (
        <p className="text-green-600 font-bold">{updateSuccessMsg}</p>
      )}

      {isEditing ? (
        <ProjectForm project={project} onCancel={handleCancelEdit} onSaveSuccess={handleSaveSuccess} />
      ) : (
        <div className="w-full">
          <ProjectInfo project={project} />
          <div className="flex justify-end gap-4 mt-4">
            {/* <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleEdit}
            >
              Editar
            </button> */}
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

      <CreateMeetingModal
        isOpen={showMeetingModal}
        onClose={() => setShowMeetingModal(false)}
        projectId={project.id}
      />

      <div className="bg-background p-6 rounded-xl shadow-md w-full mt-8">
        <h2 className="text-2xl font-bold mb-4">Reuniones</h2>
        <MeetingList meetings={projectMeetings} projectId={project.id} />
      </div>

      <div className="bg-background p-6 rounded-xl shadow-md w-full mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Requerimientos</h2>
          {/* <div className="flex gap-4">
            <ExecuteWorkflowButton />
          </div> */}
        </div>
        <RequirementList requirements={requirements} />
      </div>
    </div>
  );
};

export default ProjectDetail;