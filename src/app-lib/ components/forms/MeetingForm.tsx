import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/smartspecs/app-lib/redux/store";
import { createMeeting, fetchMeetingsByProjectId } from "@/smartspecs/app-lib/redux/slices/MeetingsSlice";
import { updateRequirement, createRequirement } from "@/smartspecs/app-lib/redux/slices/RequirementsSlice";

const useAppDispatch = () => useDispatch<AppDispatch>();

interface MeetingFormProps {
  onCancel: () => void;
  onSaveSuccess?: () => void;
  projectId: string;
  projectTitle: string;
  projectDescription: string;
  projectClient: string;
  requirementsList: object[];
}

const MeetingForm: React.FC<MeetingFormProps> = ({
  onCancel,
  onSaveSuccess,
  projectId,
  projectTitle,
  projectDescription,
  projectClient,
  requirementsList,
}) => {
  const dispatch = useAppDispatch();
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingDescription, setMeetingDescription] = useState("");
  const [meetingTranscription, setMeetingTranscription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await dispatch(
      createMeeting({
        projectId: projectId,
        projectTitle: projectTitle,
        projectDescription: projectDescription,
        projectClient: projectClient,
        meetingTitle: meetingTitle,
        meetingDescription: meetingDescription,
        meetingTranscription: meetingTranscription,
        requirementsList: requirementsList,
      })
    );

    if (result.meta.requestStatus === 'fulfilled') {
      const { updatedRequirementsList, newRequirementsList } = result.payload as any;

      // Actualizar requerimientos existentes
      if (updatedRequirementsList && updatedRequirementsList.length > 0) {
        for (const requirement of updatedRequirementsList) {
          await dispatch(updateRequirement({
            id: requirement.id,
            updatedData: requirement
          }));
        }
      }

      // Crear nuevos requerimientos
      if (newRequirementsList && newRequirementsList.length > 0) {
        for (const requirement of newRequirementsList) {
          await dispatch(createRequirement({
            ...requirement,
            projectId: projectId
          }));
        }
      }
    }

    // Vuelve a cargar las reuniones después de crear una nueva
    await dispatch(fetchMeetingsByProjectId(projectId));
    setIsLoading(false);
    // Limpia y cierra
    setMeetingTitle("");
    setMeetingDescription("");
    setMeetingTranscription("");
    onSaveSuccess?.();
    onCancel();
  };

  return (
    <form onSubmit={handleCreateMeeting} className="space-y-4">
      <div>
        <label className="block font-semibold mb-1">Título:</label>
        <input
          type="text"
          className="border w-full p-2 rounded text-black"
          value={meetingTitle}
          onChange={(e) => setMeetingTitle(e.target.value)}
          placeholder="Nombre de la reunión"
          required
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">Descripción:</label>
        <textarea
          className="border w-full p-2 rounded text-black"
          value={meetingDescription}
          onChange={(e) => setMeetingDescription(e.target.value)}
          placeholder="Describe brevemente la reunión"
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">Transcripción:</label>
        <textarea
          className="border w-full p-2 rounded text-black min-h-[200px]"
          value={meetingTranscription}
          onChange={(e) => setMeetingTranscription(e.target.value)}
          placeholder="Ingresa la transcripción de la reunión"
        />
      </div>
      <button
        type="submit"
        className="bg-primary text-background px-4 py-2 rounded"
        disabled={isLoading}
      >
        {isLoading ? "Creando..." : "Crear"}
      </button>
    </form>
  );
};

export default MeetingForm; 