import React from 'react';
import { useRequirementList } from '../../../hooks/useRequirementList';
import ConfirmModal from '../../modals/ConfirmModal';
import RequirementRow from './RequirementRow';
import { Requirement, Priority } from '@/smartspecs/app-lib/interfaces/requirement';

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

  if (requirements.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg">
        <p className="text-gray-500 text-lg">No hay requerimientos registrados para este proyecto</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-12 px-1 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
              #
            </th>
            <th className="w-1/4 px-2 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Título
            </th>
            <th className="w-2/5 px-2 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Descripción
            </th>
            <th className="w-24 px-2 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Prioridad
            </th>
            <th className="w-24 px-2 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Estado
            </th>
            <th className="w-20 px-2 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {requirements.map((requirement, index) => (
            <RequirementRow
              key={requirement.id}
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