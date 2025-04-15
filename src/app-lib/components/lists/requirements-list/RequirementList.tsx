import React from "react";
import RequirementRow from "./RequirementRow";
import RequirementHistory from "./RequirementHistory";
import ConfirmModal from "../../modals/ConfirmModal";
import { Requirement, Priority } from "@/smartspecs/app-lib/interfaces/requirement";
import { useRequirementList } from "@/smartspecs/app-lib/hooks/requirements/useRequirementList";
import { useRequirementHistory } from "@/smartspecs/app-lib/hooks/requirements/useRequirementsHistory";

interface RequirementListProps {
  requirements: Requirement[];
}

const RequirementList: React.FC<RequirementListProps> = ({ requirements }) => {
  const {
    editingId,
    tempTitle,
    tempDescription,
    tempPriority,
    tempStatus,
    showDeleteModal,
    setTempTitle,
    setTempDescription,
    setTempPriority,
    setTempStatus,
    handleEditClick,
    handleDeleteClick,
    confirmDelete,
    cancelDelete,
  } = useRequirementList();

  const {
    expandedId,
    histories,
    toggleExpand,
  } = useRequirementHistory();

  const sortedRequirements = [...requirements].sort((a, b) =>
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  if (requirements.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 bg-white rounded-xl border border-gray-100 shadow-sm transition-all duration-300 ease-in-out">
        <p className="text-gray-500 text-lg font-medium">No hay requerimientos registrados para este proyecto</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 shadow-sm bg-white">
      <table className="min-w-full divide-y divide-gray-100">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-12 px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">#</th>
            <th className="w-1/4 px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Título</th>
            <th className="w-2/5 px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Descripción</th>
            <th className="w-24 px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Prioridad</th>
            <th className="w-24 px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Estado</th>
            <th className="w-20 px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {sortedRequirements.map((requirement, index) => (
            <React.Fragment key={requirement.id}>
              <RequirementRow
                requirement={requirement}
                index={index}
                isEditing={editingId === requirement.id}
                tempTitle={tempTitle}
                tempDescription={tempDescription}
                tempPriority={tempPriority}
                tempStatus={tempStatus}
                onTitleChange={setTempTitle}
                onDescriptionChange={setTempDescription}
                onPriorityChange={setTempPriority as (value: Priority) => void}
                onStatusChange={setTempStatus}
                onEditClick={() => handleEditClick(requirement)}
                onDeleteClick={() => handleDeleteClick(requirement.id)}
              />

              <tr className="bg-gray-50/50">
                <td colSpan={6} className="px-4 py-2 text-right">
                  <button
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-all duration-200 ease-in-out hover:scale-105 active:scale-95"
                    onClick={() => toggleExpand(requirement.id)}
                  >
                    {expandedId === requirement.id ? (
                      <>
                        <span>Ocultar historial</span>
                        <svg className="w-4 h-4 ml-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </>
                    ) : (
                      <>
                        <span>Ver historial</span>
                        <svg className="w-4 h-4 ml-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </>
                    )}
                  </button>
                </td>
              </tr>

              {expandedId === requirement.id && (
                <tr className="bg-white">
                  <td colSpan={6} className="px-4 pb-4">
                    <div className="mt-2 bg-gray-50/50 rounded-lg p-4 transition-all duration-300 ease-in-out">
                      <RequirementHistory histories={histories[requirement.id] || []} />
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Confirmar eliminación"
        message="¿Estás seguro de que deseas eliminar este requerimiento? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        confirmButtonStyle="danger"
      />
    </div>
  );
};

export default RequirementList;