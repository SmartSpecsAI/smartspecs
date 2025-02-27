"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import {
  fetchMeetingById,
  updateMeeting,
  deleteMeeting,
} from "@/smartspecs/lib/presentation/redux/slices/MeetingsSlice";
import { AppDispatch, RootState } from "@/smartspecs/lib/presentation/redux/store";

// Modal simple para confirmar eliminación
const ConfirmModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-background p-6 rounded shadow-md w-full max-w-sm relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-text text-xl font-bold"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-2">¿Eliminar reunión?</h2>
        <p className="mb-4">Esta acción no se puede deshacer</p>
        <div className="flex gap-3 justify-end">
          <button
            className="bg-gray-300 text-text px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="bg-danger text-background px-4 py-2 rounded"
            onClick={onConfirm}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

const MeetingDetail: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Campos para editar
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  // Tomamos el ID de la URL
  const meetingId = pathname ? pathname.split("/").pop() : null;

  // Accedemos al state
  const { meetings, loading, error } = useSelector(
    (state: RootState) => state.meetings
  );

  // Buscamos la reunión en el store
  const meeting = meetings.find((m) => m.id === meetingId);

  // Si no está, la pedimos a Firestore
  useEffect(() => {
    if (meetingId && !meeting) {
      dispatch(fetchMeetingById(meetingId));
    }
  }, [meetingId, meeting, dispatch]);

  // Cuando vayamos a editar, llenamos el form
  useEffect(() => {
    if (meeting && isEditing) {
      setFormData({
        title: meeting.title,
        description: meeting.description,
      });
    }
  }, [meeting, isEditing]);

  // Maneja cambios del input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Guardar cambios
  const handleSaveEdit = async () => {
    if (!meeting) return;
    const updatedData = {
      title: formData.title,
      description: formData.description,
    };
    await dispatch(
      updateMeeting({ meetingId: meeting.id, updatedData })
    );
    setIsEditing(false);
  };

  // Confirmar eliminar
  const handleConfirmDelete = async () => {
    if (!meeting) return;
    await dispatch(deleteMeeting(meeting.id));
    setShowDeleteModal(false);
    // Redirigir a otra parte (ej. back to projects)
    router.push("/projects");
  };

  if (loading) {
    return <p className="text-center mt-5">Cargando reunión...</p>;
  }
  if (error) {
    return <p className="text-center mt-5 text-red-500">{error}</p>;
  }
  if (!meeting) {
    return <p className="text-center mt-5">Reunión no encontrada</p>;
  }

  return (
    <div className="min-h-screen bg-background text-text p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Detalle de Reunión</h1>

      {isEditing ? (
        // ---------- MODO EDICIÓN ----------
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
      ) : (
        // ---------- MODO LECTURA ----------
        <div className="border rounded p-4 max-w-md w-full">
          <p className="text-lg mb-2">
            <strong>Título:</strong> {meeting.title}
          </p>
          <p className="mb-2">
            <strong>Descripción:</strong> {meeting.description}
          </p>
          <p className="mb-2">
            <strong>Fecha:</strong>{" "}
            {meeting.date
              ? new Date(meeting.date).toLocaleString()
              : "Sin fecha"}
          </p>
          <p className="mb-2">
            <strong>Audio:</strong>{" "}
            {meeting.audioId ? (
              <span>{meeting.audioId}</span>
            ) : (
              <em>No hay audio</em>
            )}
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
      )}

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default MeetingDetail;