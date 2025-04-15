import React, { useState } from "react";
import { useRequirementList } from "../../../hooks/useRequirementList";
import ConfirmModal from "../../modals/ConfirmModal";
import RequirementRow from "./RequirementRow";
import { Requirement, Priority } from "@/smartspecs/app-lib/interfaces/requirement";
import {
  collection,
  getDocs,
  DocumentData,
  Timestamp,
} from "firebase/firestore";
import { firestore } from "@/smartspecs/lib/config/firebase-settings";

interface RequirementListProps {
  requirements: Requirement[];
}

const RequirementList: React.FC<RequirementListProps> = ({ requirements }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [histories, setHistories] = useState<Record<string, DocumentData[]>>({});

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

  const sortedRequirements = [...requirements].sort((a, b) =>
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const toggleExpand = async (reqId: string) => {
    if (expandedId === reqId) {
      setExpandedId(null);
    } else {
      setExpandedId(reqId);

      if (!histories[reqId]) {
        const ref = collection(firestore, "requirements", reqId, "history");
        const snap = await getDocs(ref);
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setHistories((prev) => ({ ...prev, [reqId]: data }));
      }
    }
  };

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
            <th className="w-12 px-1 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">#</th>
            <th className="w-1/4 px-2 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Título</th>
            <th className="w-2/5 px-2 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Descripción</th>
            <th className="w-24 px-2 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Prioridad</th>
            <th className="w-24 px-2 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Estado</th>
            <th className="w-20 px-2 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
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

              <tr className="bg-gray-50">
                <td colSpan={6} className="px-2 py-2 text-right">
                  <button
                    className="text-sm text-blue-600 hover:underline"
                    onClick={() => toggleExpand(requirement.id)}
                  >
                    {expandedId === requirement.id ? "Ocultar historial" : "Ver historial"}
                  </button>
                </td>
              </tr>

              {expandedId === requirement.id && histories[requirement.id] && (
                <tr className="bg-white">
                  <td colSpan={6} className="px-4 pb-4">
                    <div className="space-y-2 text-sm text-gray-700">
                      {histories[requirement.id].length === 0 ? (
                        <p className="text-gray-500 italic">Sin historial de cambios.</p>
                      ) : (
                        histories[requirement.id]
                          .sort((a, b) =>
                            (a.changedAt?.seconds ?? 0) < (b.changedAt?.seconds ?? 0) ? 1 : -1
                          )
                          .map((entry) => (
                            <div
                              key={entry.id}
                              className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                            >
                              <p className="text-xs text-gray-500">
                                <strong>{entry.changedBy ?? "Desconocido"}</strong> &middot;{" "}
                                {new Date(entry.changedAt?.seconds * 1000).toLocaleString()}
                              </p>
                              <ul className="mt-1 list-disc list-inside">
                                {Object.entries(entry.fields || {}).map(
                                  ([field, { oldValue, newValue }]: any) => (
                                    <li key={field}>
                                      <strong>{field}:</strong>{" "}
                                      <span className="line-through text-red-500">{oldValue}</span>{" "}
                                      →
                                      <span className="text-green-600 ml-1">{newValue}</span>
                                    </li>
                                  )
                                )}
                              </ul>
                              {entry.reason && (
                                <p className="mt-1 text-sm text-gray-500 italic">
                                  💡 {entry.reason}
                                </p>
                              )}
                            </div>
                          ))
                      )}
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