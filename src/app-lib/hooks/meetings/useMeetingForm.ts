import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/smartspecs/app-lib/redux/store";

// Importamos acciones CRUD del slice de Meetings
import {
  createMeeting,
  updateMeeting,
  getMeetingsByProject,
} from "@/smartspecs/app-lib/redux/slices/MeetingsSlice";

// Importamos acciones CRUD para Requirements
import {
  updateRequirement,
  createRequirement,
} from "@/smartspecs/app-lib/redux/slices/RequirementsSlice";

// Importamos la utilidad de Dify
import { callDifyWorkflow } from "@/smartspecs/app-lib/utils/dify";
import { Meeting } from "@/smartspecs/app-lib/interfaces/meeting";

interface UseMeetingFormProps {
  // Si existe meeting => Modo edición
  meeting?: Meeting;

  // Si es creación => necesitamos un projectId mínimo
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
        const updatedData = {
          title,
          description,
          transcription,
        };
        const updateAction = await dispatch(
          updateMeeting({ id: meeting.id, updatedData })
        );

        if (updateAction.meta.requestStatus === "fulfilled") {
          // Si quisieras volver a correr Dify en edición, podrías hacerlo aquí.
          onSaveSuccess?.();
          onCancel(); // Cierra el form
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

          // 2) Llamamos al workflow de Dify
          let updatedRequirementsList: any[] = [];
          let newRequirementsList: any[] = [];
          try {
            const wfResp = await callDifyWorkflow(
              projectId,
              createdMeeting.id,
              projectTitle || "",
              projectDescription || "",
              projectClient || "",
              title,
              description,
              transcription,
              requirementsList || []
            );
            updatedRequirementsList = wfResp?.updatedRequirementsList ?? [];
            newRequirementsList = wfResp?.newRequirementsList ?? [];
          } catch (error) {
            console.error("⚠️ Error en el workflow de Dify:", error);
          }

          // 3) Actualizamos o creamos requerimientos si Dify generó algo
          if (updatedRequirementsList.length > 0) {
            for (const req of updatedRequirementsList) {
              await dispatch(updateRequirement({ id: req.id, updatedData: req }));
            }
          }
          if (newRequirementsList.length > 0) {
            for (const req of newRequirementsList) {
              await dispatch(createRequirement({ ...req, projectId }));
            }
          }

          // 4) Refrescamos la lista de reuniones del proyecto
          await dispatch(getMeetingsByProject(projectId));

          // 5) Reseteamos el formulario
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