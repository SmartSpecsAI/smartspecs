import React from "react";
import { useMeetingForm } from "@/smartspecs/app-lib/hooks/useMeetingForm";

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
  const {
    meetingTitle,
    setMeetingTitle,
    meetingDescription,
    setMeetingDescription,
    meetingTranscription,
    setMeetingTranscription,
    isLoading,
    handleCreateMeeting,
  } = useMeetingForm({
    formData,
    projectId,
    projectTitle,
    projectDescription,
    projectClient,
    requirementsList,
    isEditing,
    onSaveSuccess,
    onCancel,
    handleSaveEdit,
    setIsEditing,
  });

  return (
    <form onSubmit={handleCreateMeeting} className="space-y-6 w-full mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Título:</label>
        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
          value={isEditing ? formData?.title : meetingTitle}
          onChange={isEditing ? handleChange : (e) => setMeetingTitle(e.target.value)}
          placeholder="Nombre de la reunión"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Descripción:</label>
        <textarea
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
          value={isEditing ? formData?.description : meetingDescription}
          onChange={isEditing ? handleChange : (e) => setMeetingDescription(e.target.value)}
          placeholder="Describe brevemente la reunión"
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Transcripción:</label>
        <textarea
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
          value={isEditing ? formData?.transcription : meetingTranscription}
          onChange={isEditing ? handleChange : (e) => setMeetingTranscription(e.target.value)}
          placeholder="Ingresa la transcripción de la reunión"
          rows={6}
        />
      </div>
      <div className="flex gap-4 justify-end pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-6 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? (isEditing ? "Guardando..." : "Creando...") : (isEditing ? "Guardar" : "Crear")}
        </button>
      </div>
    </form>
  );
};

export default MeetingForm; 