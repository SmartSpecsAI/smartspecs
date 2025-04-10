import React from 'react';
import { Requirement } from '@/smartspecs/app-lib/redux/slices/RequirementsSlice';
import { useRequirementList } from '../../hooks/useRequirementList';
import ConfirmModal from '../modals/ConfirmModal';
import RequirementRow from './RequirementRow';

interface RequirementListProps {
  requirements: Requirement[];
}

const RequirementList: React.FC<RequirementListProps> = ({ requirements }) => {
  const {
    editingId,
    tempTitle,
    tempDescription,
    tempPriority,
    showDeleteModal,
    setTempTitle,
    setTempDescription,
    setTempPriority,
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
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Título
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Descripción
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Prioridad
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
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
              onTitleChange={setTempTitle}
              onDescriptionChange={setTempDescription}
              onPriorityChange={setTempPriority}
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