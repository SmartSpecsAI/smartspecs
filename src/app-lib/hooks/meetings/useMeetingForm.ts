// src/app-lib/hooks/meetings/useMeetingForm.ts

import { useState, useEffect } from "react";
import { useDispatch, useStore } from "react-redux"; // 👈 Importamos useStore también
import { AppDispatch, RootState } from "@/smartspecs/app-lib/redux/store";
import {
  createMeeting,
  updateMeeting,
  getMeetingsByProject,
} from "@/smartspecs/app-lib/redux/slices/MeetingsSlice";
import { Meeting } from "@/smartspecs/app-lib/interfaces/meeting";
import { processDifyWorkflow } from "@/smartspecs/app-lib/utils/difyProcessor";
import { Requirement } from "@/smartspecs/app-lib/interfaces/requirement";

interface UseMeetingFormProps {
  meeting?: Meeting;
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
  const store = useStore<RootState>(); // 👈 Creamos store

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [transcription, setTranscription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
        // === Edición de reunión ===
        const updatedData = { title, description, transcription };
        const updateAction = await dispatch(
          updateMeeting({ id: meeting.id, updatedData })
        );

        if (updateAction.meta.requestStatus === "fulfilled") {
          onSaveSuccess?.();
          onCancel();
        } else {
          console.error("Error actualizando la reunión");
        }
      } else {
        // === Creación de reunión ===
        if (!projectId) {
          console.error("No hay projectId para crear reunión");
          setIsLoading(false);
          return;
        }

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

          // ⚡ Llamar al workflow de Dify
          await processDifyWorkflow({
            dispatch,
            //getState: store.getState, // 👈 pass getState
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

          // Refrescamos lista
          await dispatch(getMeetingsByProject(projectId));

          // Reseteamos formulario
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