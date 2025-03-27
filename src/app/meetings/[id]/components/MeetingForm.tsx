import React from "react";

const MeetingForm: React.FC<{
  formData: { title: string; description: string; transcription: string; },
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  handleSaveEdit: () => void,
  setIsEditing: (value: boolean) => void
}> = ({ formData, handleChange, handleSaveEdit, setIsEditing }) => (
  <div className="border rounded p-4 max-w-md w-full">
    <label className="block mb-2 font-semibold">Título:</label>
    <input
      className="border w-full mb-4 p-2 rounded text-black"
      name="title"
      value={formData.title}
      onChange={handleChange}
    />

    <label className="block mb-2 font-semibold">Descripción:</label>
    <textarea
      className="border w-full mb-4 p-2 rounded text-black"
      name="description"
      value={formData.description}
      onChange={handleChange}
    />

    <label className="block mb-2 font-semibold">Transcripción:</label>
    <textarea
      className="border w-full mb-4 p-2 rounded text-black min-h-[200px]"
      name="transcription"
      value={formData.transcription}
      onChange={handleChange}
    />

    <div className="flex gap-4">
      <button
        className="bg-primary text-background px-4 py-2 rounded"
        onClick={handleSaveEdit}
      >
        Guardar
      </button>
      <button
        className="bg-danger text-background px-4 py-2 rounded"
        onClick={() => setIsEditing(false)}
      >
        Cancelar
      </button>
    </div>
  </div>
);

export default MeetingForm; 