import React from "react";
import { Meeting } from "@/smartspecs/app-lib/interfaces/meeting";
import { useMeetingForm } from "@/smartspecs/app-lib/hooks/meetings/useMeetingForm";

interface MeetingFormProps {
  onCancel: () => void;
  onSaveSuccess?: () => void;
  onProcessingStart?: () => void;

  // Si es edición, pasamos la meeting
  meeting?: Meeting;

  // Si es creación, pasamos lo siguiente
  projectId?: string;
  projectTitle?: string;
  projectDescription?: string;
  projectClient?: string;
  requirementsList?: object[];
}

const MeetingForm: React.FC<MeetingFormProps> = ({
  meeting,
  onCancel,
  onSaveSuccess,
  onProcessingStart,
  projectId,
  projectTitle,
  projectDescription,
  projectClient,
  requirementsList,
}) => {
  const {
    title,
    setTitle,
    description,
    setDescription,
    transcription,
    setTranscription,
    isLoading,
    handleSubmit,
  } = useMeetingForm({
    meeting,
    projectId,
    projectTitle,
    projectDescription,
    projectClient,
    requirementsList,
    onSaveSuccess,
    onCancel,
    onProcessingStart,
  });

  // Para indicar si es edición en la UI
  const isEditMode = !!meeting;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 w-full mx-auto p-6 bg-white rounded-lg shadow-lg"
    >
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Título:</label>
        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nombre de la reunión"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Descripción:
        </label>
        <textarea
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe brevemente la reunión"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Transcripción:
        </label>
        <textarea
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
          value={transcription}
          onChange={(e) => setTranscription(e.target.value)}
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
          {isLoading
            ? isEditMode
              ? "Guardando..."
              : "Creando..."
            : isEditMode
            ? "Guardar"
            : "Crear"}
        </button>
      </div>
    </form>
  );
};

export default MeetingForm;