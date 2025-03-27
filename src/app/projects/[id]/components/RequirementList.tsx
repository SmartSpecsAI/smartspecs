import { deleteRequirement, Requirement, updateRequirement } from "@/smartspecs/lib/presentation/redux/slices/RequirementsSlice";
import React, { useState } from "react";
import { useAppDispatch } from "./CreateMeetingModal";

interface RequirementListProps {
  requirements: Requirement[];
}

const RequirementList: React.FC<RequirementListProps> = ({ requirements }) => {
  // NEW - Control de edición (inline)
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempTitle, setTempTitle] = useState("");
  const [tempDescription, setTempDescription] = useState("");
  const [tempPriority, setTempPriority] = useState<"low" | "medium" | "high">("medium");

  // NEW - Control de modal de eliminación
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const dispatch = useAppDispatch();

  if (requirements.length === 0) {
    return <p className="text-center">No hay requerimientos registrados para este proyecto</p>;
  }

  // NEW - Funciones para edición
  const handleEditClick = (req: Requirement) => {
    if (editingId === req.id) {
      // Si ya estamos en modo edición, confirmar (guardar) los cambios
      dispatch(
        updateRequirement({
          id: req.id,
          updatedData: {
            title: tempTitle,
            description: tempDescription,
            priority: tempPriority,
          },
        })
      );
      setEditingId(null);
    } else {
      // Entrar en modo edición: cargar los valores en states
      setEditingId(req.id);
      setTempTitle(req.title);
      setTempDescription(req.description);
      setTempPriority(req.priority);
    }
  };

  const handleDeleteClick = (reqId: string) => {
    setDeleteId(reqId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    dispatch(deleteRequirement(deleteId));
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Título
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Descripción
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Prioridad
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            {/* NEW - Columna de acciones */}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {requirements.map((requirement, index) => {
            const isEditing = editingId === requirement.id;
            return (
              <tr key={requirement.id} className="hover:bg-gray-50">
                {/* Título */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {isEditing ? (
                    <input
                      className="border p-1 w-full"
                      value={tempTitle}
                      onChange={(e) => setTempTitle(e.target.value)}
                    />
                  ) : (
                    <div className="text-sm font-medium text-gray-900">
                      {index + 1}. {requirement.title}
                    </div>
                  )}
                </td>

                {/* Descripción */}
                <td className="px-6 py-4">
                  {isEditing ? (
                    <textarea
                      className="border p-1 w-full"
                      rows={2}
                      value={tempDescription}
                      onChange={(e) => setTempDescription(e.target.value)}
                    />
                  ) : (
                    <div className="text-sm text-gray-900">{requirement.description}</div>
                  )}
                </td>

                {/* Prioridad */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {isEditing ? (
                    <select
                      className="border p-1"
                      value={tempPriority}
                      onChange={(e) =>
                        setTempPriority(e.target.value as "low" | "medium" | "high")
                      }
                    >
                      <option value="low">Baja</option>
                      <option value="medium">Media</option>
                      <option value="high">Alta</option>
                    </select>
                  ) : (
                    <div className="text-sm text-gray-900">{requirement.priority}</div>
                  )}
                </td>

                {/* Estado (solo visual en este ejemplo) */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{requirement.status}</div>
                </td>

                {/* NEW - Botones de acción */}
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    onClick={() => handleEditClick(requirement)}
                  >
                    {isEditing ? "Guardar" : "Editar"}
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    onClick={() => handleDeleteClick(requirement.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* NEW - Modal de confirmación para eliminar */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-4 rounded shadow-md">
            <p className="mb-4">¿Seguro que quieres eliminar este requerimiento?</p>
            <div className="flex gap-2 justify-end">
              <button
                className="bg-gray-300 px-3 py-1 rounded"
                onClick={cancelDelete}
              >
                Cancelar
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={confirmDelete}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequirementList;