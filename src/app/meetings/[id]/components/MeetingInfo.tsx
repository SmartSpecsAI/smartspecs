import React from "react";
import { Meeting } from "@/smartspecs/app-lib/redux/slices/MeetingsSlice";

const MeetingInfo: React.FC<{
  meeting: Meeting,
  setIsEditing: (value: boolean) => void,
  setShowDeleteModal: (value: boolean) => void
}> = ({ meeting, setIsEditing, setShowDeleteModal }) => (
  <div className="border rounded p-4 max-w-md w-full">
    <p className="text-lg mb-2">
      <strong>Título:</strong> {meeting.meetingTitle}
    </p>
    <p className="mb-2">
      <strong>Descripción:</strong> {meeting.meetingDescription}
    </p>
    <p className="mb-2">
      <strong>Fecha:</strong> {meeting.createdAt ? new Date(meeting.createdAt).toLocaleString() : "Sin fecha"}
    </p>
    <p className="mb-2">
      <strong>Transcripción:</strong> {meeting.meetingTranscription ? <span className="whitespace-pre-wrap">{meeting.meetingTranscription}</span> : <em>No hay transcripción</em>}
    </p>
    <div className="flex gap-4 mt-4">
      <button
        className="bg-primary text-background px-4 py-2 rounded"
        onClick={() => setIsEditing(true)}
      >
        Editar
      </button>
      <button
        className="bg-danger text-background px-4 py-2 rounded"
        onClick={() => setShowDeleteModal(true)}
      >
        Eliminar
      </button>
    </div>
  </div>
);

export default MeetingInfo; 