// src/app-lib/hooks/meetings/useMeetingForm.ts
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/smartspecs/app-lib/redux/store";
import {
  createMeeting,
  updateMeeting,
  getMeetingsByProject,
} from "@/smartspecs/app-lib/redux/slices/MeetingsSlice";
import { Meeting } from "@/smartspecs/app-lib/interfaces/meeting";

// Importamos nuestra nueva utilidad para Dify
import { processDifyWorkflow } from "@/smartspecs/app-lib/utils/difyProcessor";
import { Requirement } from "@/smartspecs/app-lib/interfaces/requirement";

interface UseMeetingFormProps {
  // Modo edición
  meeting?: Meeting;

  // Modo creación
  projectId?: string;
  projectTitle?: string;
  projectDescription?: string;
  projectClient?: string;
  requirementsList?: object[];

  onSaveSuccess?: () => void;
  onCancel: () => void;
}

export const useMeetingForm = ({
  meeting,
  projectId,
  projectTitle,
  projectDescription,
  projectClient,
  requirementsList,
  onSaveSuccess,
  onCancel,
}: UseMeetingFormProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [transcription, setTranscription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Prellenar campos si estamos en modo edición
  useEffect(() => {
    if (meeting) {
      setTitle(meeting.title || "");
      setDescription(meeting.description || "");
      setTranscription(meeting.transcription || "");
    }
  }, [meeting]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (meeting) {
        // === Modo Edición ===
        const updatedData = { title, description, transcription };
        const updateAction = await dispatch(
          updateMeeting({ id: meeting.id, updatedData })
        );

        if (updateAction.meta.requestStatus === "fulfilled") {
          // Si quisieras llamar a Dify en edición, podrías hacerlo aquí:
          // await processDifyWorkflow(...);
          onSaveSuccess?.();
          onCancel();
        } else {
          console.error("Error actualizando la reunión");
        }
      } else {
        // === Modo Creación ===
        if (!projectId) {
          console.error("No hay projectId, no podemos crear Meeting");
          setIsLoading(false);
          return;
        }

        // 1) Creamos la reunión
        const createResult = await dispatch(
          createMeeting({
            projectId,
            title,
            description,
            transcription,
          })
        );

        if (createResult.meta.requestStatus === "fulfilled") {
          const createdMeeting = createResult.payload as Meeting;

          // 2) Llamamos al workflow de Dify en un util aparte
          await processDifyWorkflow({
            dispatch,
            projectId,
            meetingId: createdMeeting.id,
            projectTitle: projectTitle || "",
            projectDescription: projectDescription || "",
            projectClient: projectClient || "",
            meetingTitle: title,
            meetingDescription: description,
            meetingTranscription: transcription,
            requirementsList: requirementsList as Requirement[],
          });

          // 3) Refrescamos la lista de reuniones
          await dispatch(getMeetingsByProject(projectId));

          // 4) Reseteamos
          setTitle("");
          setDescription("");
          setTranscription("");

          onSaveSuccess?.();
          onCancel();
        } else {
          console.error("Error creando la reunión");
        }
      }
    } catch (err) {
      console.error("Error en handleSubmit:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    transcription,
    setTranscription,
    isLoading,
    handleSubmit,
  };
};