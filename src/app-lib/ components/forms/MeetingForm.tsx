import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/smartspecs/app-lib/redux/store";
import { createMeeting, fetchMeetingsByProjectId } from "@/smartspecs/app-lib/redux/slices/MeetingsSlice";
import { updateRequirement, createRequirement } from "@/smartspecs/app-lib/redux/slices/RequirementsSlice";

const useAppDispatch = () => useDispatch<AppDispatch>();

interface MeetingFormProps {
  onCancel: () => void;
  onSaveSuccess?: () => void;
  projectId?: string;
  projectTitle?: string;
  projectDescription?: string;
  projectClient?: string;
  requirementsList?: object[];
  formData?: {
    title: string;
    description: string;
    transcription: string;
  };
  handleChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSaveEdit?: () => Promise<void>;
  setIsEditing?: (value: boolean) => void;
  isEditing?: boolean;
}

const MeetingForm: React.FC<MeetingFormProps> = ({
  onCancel,
  onSaveSuccess,
  projectId,
  projectTitle,
  projectDescription,
  projectClient,
  requirementsList,
  formData,
  handleChange,
  handleSaveEdit,
  setIsEditing,
  isEditing = false,
}) => {
  const dispatch = useAppDispatch();
  const [meetingTitle, setMeetingTitle] = useState(formData?.title || "");
  const [meetingDescription, setMeetingDescription] = useState(formData?.description || "");
  const [meetingTranscription, setMeetingTranscription] = useState(formData?.transcription || "");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (formData) {
      setMeetingTitle(formData.title);
      setMeetingDescription(formData.description);
      setMeetingTranscription(formData.transcription);
    }
  }, [formData]);

  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (isEditing && handleSaveEdit) {
      await handleSaveEdit();
      setIsEditing?.(false);
      setIsLoading(false);
      return;
    }

    if (!projectId) return;

    const result = await dispatch(
      createMeeting({
        projectId: projectId,
        projectTitle: projectTitle || "",
        projectDescription: projectDescription || "",
        projectClient: projectClient || "",
        meetingTitle: meetingTitle,
        meetingDescription: meetingDescription,
        meetingTranscription: meetingTranscription,
        requirementsList: requirementsList || [],
      })
    );

    if (result.meta.requestStatus === 'fulfilled') {
      const { updatedRequirementsList, newRequirementsList } = result.payload as any;

      if (updatedRequirementsList && updatedRequirementsList.length > 0) {
        for (const requirement of updatedRequirementsList) {
          await dispatch(updateRequirement({
            id: requirement.id,
            updatedData: requirement
          }));
        }
      }

      if (newRequirementsList && newRequirementsList.length > 0) {
        for (const requirement of newRequirementsList) {
          await dispatch(createRequirement({
            ...requirement,
            projectId: projectId
          }));
        }
      }
    }

    await dispatch(fetchMeetingsByProjectId(projectId));
    setIsLoading(false);
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
          value={isEditing ? formData?.title : meetingTitle}
          onChange={isEditing ? handleChange : (e) => setMeetingTitle(e.target.value)}
          placeholder="Nombre de la reunión"
          required
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">Descripción:</label>
        <textarea
          className="border w-full p-2 rounded text-black"
          value={isEditing ? formData?.description : meetingDescription}
          onChange={isEditing ? handleChange : (e) => setMeetingDescription(e.target.value)}
          placeholder="Describe brevemente la reunión"
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">Transcripción:</label>
        <textarea
          className="border w-full p-2 rounded text-black min-h-[200px]"
          value={isEditing ? formData?.transcription : meetingTranscription}
          onChange={isEditing ? handleChange : (e) => setMeetingTranscription(e.target.value)}
          placeholder="Ingresa la transcripción de la reunión"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-primary text-background px-4 py-2 rounded"
          disabled={isLoading}
        >
          {isLoading ? (isEditing ? "Guardando..." : "Creando...") : (isEditing ? "Guardar" : "Crear")}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 text-background px-4 py-2 rounded"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default MeetingForm; 