// src/app-lib/hooks/projects/useProjectDetailUI.ts

import { useState } from "react";
import { Project } from "@/smartspecs/app-lib/interfaces/project";

/**
 * Maneja estados de interfaz en la vista de "detalle de proyecto":
 * - isEditing
 * - mostrar o no la modal de reuniones
 * - mensajes de éxito al crear/actualizar
 * - lógica de "eliminar todas las reuniones"
 */
export const useProjectDetail = (project?: Project) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deleteSuccessMsg, setDeleteSuccessMsg] = useState("");
  const [updateSuccessMsg, setUpdateSuccessMsg] = useState("");
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [isDeletingMeetings, setIsDeletingMeetings] = useState(false);

  // Ejemplo: si quisieras eliminar todo el proyecto desde acá, podrías
  // meterlo en un "useProjectActions.ts" con removeProject() y llamarlo aquí.

  const handleEdit = () => {
    setIsEditing(true);
    setUpdateSuccessMsg("");
    setDeleteSuccessMsg("");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setUpdateSuccessMsg("");
    setDeleteSuccessMsg("");
  };

  const handleSaveSuccess = (message: string) => {
    setIsEditing(false);
    setUpdateSuccessMsg(message);
  };

  const handleDeleteAllMeetings = async () => {
    if (!project?.id) return;
    try {
      setIsDeletingMeetings(true);

      // Ejemplo de llamada fetch:
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_LOCAL_BASE_URL}/meetings/clear`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar las reuniones");
      }

      alert("✅ Todas las reuniones han sido eliminadas correctamente");
      // Podés disparar un refresh de reuniones, etc.
    } catch (error) {
      console.error("❌ Error eliminando reuniones:", error);
      alert("❌ Error al eliminar las reuniones");
    } finally {
      setIsDeletingMeetings(false);
    }
  };

  return {
    isEditing,
    deleteSuccessMsg,
    updateSuccessMsg,
    showMeetingModal,
    setShowMeetingModal,
    isDeletingMeetings,
    handleEdit,
    handleCancelEdit,
    handleSaveSuccess,
    handleDeleteAllMeetings,
  };
};