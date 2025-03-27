import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/smartspecs/lib/presentation/redux/store";
import { createMeeting, fetchMeetingsByProjectId } from "@/smartspecs/lib/presentation/redux/slices/MeetingsSlice";

const useAppDispatch = () => useDispatch<AppDispatch>();

const CreateMeetingModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}> = ({ isOpen, onClose, projectId }) => {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [transcription, setTranscription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Crear Reunión
  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await dispatch(
      createMeeting({
        projectId,
        title,
        description,
        transcription,
      })
    );
    // Vuelve a cargar las reuniones después de crear una nueva
    await dispatch(fetchMeetingsByProjectId(projectId));
    setIsLoading(false);
    // Limpia y cierra
    setTitle("");
    setDescription("");
    setTranscription("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-background p-6 rounded shadow-md w-3/4 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-text text-xl font-bold"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">Crear Nueva Reunión</h2>
        <form onSubmit={handleCreateMeeting} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Título:</label>
            <input
              type="text"
              className="border w-full p-2 rounded text-black"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nombre de la reunión"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Descripción:</label>
            <textarea
              className="border w-full p-2 rounded text-black"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe brevemente la reunión"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Transcripción:</label>
            <textarea
              className="border w-full p-2 rounded text-black min-h-[200px]"
              value={transcription}
              onChange={(e) => setTranscription(e.target.value)}
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
      </div>
    </div>
  );
};

export default CreateMeetingModal;

export { useAppDispatch }; 