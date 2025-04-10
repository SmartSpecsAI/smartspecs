// /app-lib/hooks/useMeetingForm.ts (o donde prefieras ubicarlo)

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/smartspecs/app-lib/redux/store";

// Importamos nuestras acciones CRUD del slice de Meetings
import {
  createMeeting,
  getMeetingsByProject,
} from "@/smartspecs/app-lib/redux/slices/MeetingsSlice";

// Importamos acciones CRUD para Requirements
import {
  updateRequirement,
  createRequirement,
} from "@/smartspecs/app-lib/redux/slices/RequirementsSlice";

// Importamos la utilidad de Dify
import { callDifyWorkflow } from "@/smartspecs/app-lib/utils/dify";

// Tipados
interface UseMeetingFormProps {
  projectId?: string;
  projectTitle?: string;
  projectDescription?: string;
  projectClient?: string;
  requirementsList?: object[];

  // Datos de formulario (si estamos editando, por ejemplo)
  formData?: {
    title: string;
    description: string;
    transcription: string;
    // ... etc
  };

  // Flags y handlers
  isEditing?: boolean;
  handleSaveEdit?: () => Promise<void>;  // si usas un callback externo
  setIsEditing?: (value: boolean) => void;
  onSaveSuccess?: () => void;
  onCancel: () => void;
}

export const useMeetingForm = ({
  projectId,
  projectTitle,
  projectDescription,
  projectClient,
  requirementsList,
  formData,
  isEditing,
  handleSaveEdit,
  setIsEditing,
  onSaveSuccess,
  onCancel,
}: UseMeetingFormProps) => {
  const dispatch = useDispatch<AppDispatch>();

  // Estados locales del formulario
  const [meetingTitle, setMeetingTitle] = useState(formData?.title || "");
  const [meetingDescription, setMeetingDescription] = useState(formData?.description || "");
  const [meetingTranscription, setMeetingTranscription] = useState(formData?.transcription || "");
  const [isLoading, setIsLoading] = useState(false);

  // Efecto para sincronizar cuando cambien los formData
  useEffect(() => {
    if (formData) {
      setMeetingTitle(formData.title);
      setMeetingDescription(formData.description);
      setMeetingTranscription(formData.transcription);
    }
  }, [formData]);

  // === Handler principal del submit ===
  const handleCreateOrEditMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Si estamos en modo edición y tenemos un handler custom
    if (isEditing && handleSaveEdit) {
      await handleSaveEdit();
      setIsEditing?.(false);
      setIsLoading(false);
      return;
    }

    if (!projectId) {
      console.error("No hay projectId, no podemos crear Meeting");
      setIsLoading(false);
      return;
    }

    // 1) Creamos la reunión en Firestore
    const createResult = await dispatch(
      createMeeting({
        projectId,
        title: meetingTitle,
        description: meetingDescription,
        transcription: meetingTranscription,
      })
    );

    // Revisamos que se haya creado la reunión
    if (createResult.meta.requestStatus === "fulfilled") {
      const createdMeeting = createResult.payload as any; // Meeting

      // 2) Llamamos al workflow de Dify
      //    (si falla, no queremos fallar el "creado" de la reunión,
      //     simplemente avisamos del error y continuamos.)
      let updatedRequirementsList: any[] = [];
      let newRequirementsList: any[] = [];

      try {
        const wfResp = await callDifyWorkflow(
          projectId,
          createdMeeting.id,      // meetingId
          projectTitle || "",
          projectDescription || "",
          projectClient || "",
          meetingTitle,
          meetingDescription,
          meetingTranscription,
          requirementsList || []
        );

        updatedRequirementsList = wfResp?.updatedRequirementsList ?? [];
        newRequirementsList = wfResp?.newRequirementsList ?? [];

      } catch (error) {
        console.error("⚠️ Error en el workflow de Dify:", error);
      }

      // 3) Si Dify generó requirements actualizados
      if (updatedRequirementsList.length > 0) {
        for (const req of updatedRequirementsList) {
          // Recuerda que “req” debe tener su “id” y “updatedData”
          // o ajusta según tu slice de requirements
          await dispatch(updateRequirement({ id: req.id, updatedData: req }));
        }
      }

      // 4) Si Dify generó nuevos requirements
      if (newRequirementsList.length > 0) {
        for (const req of newRequirementsList) {
          await dispatch(createRequirement({
            ...req,
            projectId,
          }));
        }
      }

      // 5) Refrescamos la lista de reuniones para el proyecto
      await dispatch(getMeetingsByProject(projectId));

      // Reseteamos formularios
      setMeetingTitle("");
      setMeetingDescription("");
      setMeetingTranscription("");

      onSaveSuccess?.();
      onCancel();
    }

    setIsLoading(false);
  };

  return {
    // State del formulario
    meetingTitle,
    setMeetingTitle,
    meetingDescription,
    setMeetingDescription,
    meetingTranscription,
    setMeetingTranscription,
    isLoading,

    // Handler principal
    handleCreateOrEditMeeting,
  };
};