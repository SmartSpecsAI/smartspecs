"use client";

import React, { useEffect, useState } from "react";
import { useSelector, TypedUseSelectorHook, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/smartspecs/lib/presentation/redux/store";
import {
  Project,
  fetchProjectById,
  deleteProject,
  updateProject,
} from "@/smartspecs/lib/presentation/redux/slices/ProjectsSlice";
import {
  fetchMeetingsByProjectId,
  createMeeting,
  Meeting,
} from "@/smartspecs/lib/presentation/redux/slices/MeetingsSlice";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { RequirementModal } from "@/smartspecs/lib/presentation/components/components/requirements/RequirementModal";

// --------------------- HOOKS TIPADOS ---------------------
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
const useAppDispatch = () => useDispatch<AppDispatch>();

// --------------------- MODAL CONFIRMAR ELIMINACIÓN ---------------------
const ConfirmModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}> = ({ isOpen, onClose, onConfirm, title, message }) => {
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
        <h2 className="text-xl font-bold mb-2">{title || "Confirmar"}</h2>
        <p className="mb-4">{message || "¿Estás seguro de continuar?"}</p>
        <div className="flex gap-3 justify-end">
          <button
            className="bg-gray-300 text-text px-4 py-2 rounded"
            onClick={onClose}
          >
            No
          </button>
          <button
            className="bg-primary text-background px-4 py-2 rounded"
            onClick={() => {
              onConfirm();
            }}
          >
            Sí
          </button>
        </div>
      </div>
    </div>
  );
};

// --------------------- VISTA DE DETALLE DE PROYECTO ---------------------
const ProjectDetail: React.FC = () => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  // Estado local
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteSuccessMsg, setDeleteSuccessMsg] = useState("");
  const [updateSuccessMsg, setUpdateSuccessMsg] = useState("");

  // Form para editar proyecto
  const [formData, setFormData] = useState({
    title: "",
    client: "",
    description: "",
    status: "pending" as "pending" | "approved" | "rejected",
    createdAt: "",
    updatedAt: "",
  });

  // Sacamos el ID del path
  const id = pathname ? pathname.split("/").pop() : null;

  // Seleccionamos proyectos y meetings del store
  const { projects, loading, error } = useAppSelector((state) => state.projects);
  const {
    meetings,
    loading: meetingsLoading,
    error: meetingsError,
  } = useAppSelector((state) => state.meetings);

  // Buscamos el proyecto en el store
  const project = projects.find((p: Project) => p.id === id);

  // Al montar: si no tenemos el proyecto en store, lo traemos
  // y también traemos sus reuniones
  useEffect(() => {
    if (id) {
      dispatch(fetchProjectById(id));
      dispatch(fetchMeetingsByProjectId(id));
    }
  }, [id, dispatch]);

  // Cuando se activa "editar", llenamos formData con la info del proyecto
  useEffect(() => {
    if (project && isEditing) {
      setFormData({
        title: project.title,
        client: project.client,
        description: project.description,
        status: project.status,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      });
    }
  }, [project, isEditing]);

  // Para confirmar borrado
  const handleConfirmDelete = async () => {
    if (!project) return;
    await dispatch(deleteProject(project.id));
    setShowDeleteModal(false);
    setDeleteSuccessMsg("¡Proyecto eliminado con éxito!");
  };

  // Para iniciar edición
  const handleEdit = () => {
    setIsEditing(true);
    setUpdateSuccessMsg("");
    setDeleteSuccessMsg("");
  };

  // Para cancelar edición
  const handleCancelEdit = () => {
    setIsEditing(false);
    setUpdateSuccessMsg("");
    setDeleteSuccessMsg("");
  };

  // Para guardar cambios en el proyecto
  const handleSaveEdit = async () => {
    if (!project) return;
    const now = new Date().toISOString();
    const updatedData = {
      ...formData,
      updatedAt: now,
    };
    // Actualizamos en firestore
    await dispatch(updateProject({ id: project.id, updatedData }));
    setIsEditing(false);
    setUpdateSuccessMsg("¡Proyecto actualizado con éxito!");
  };

  // Para inputs del proyecto
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Filtramos las reuniones de este proyecto
  const projectMeetings = meetings.filter((m) => m.projectId === id);

  // Render loading
  if (loading || meetingsLoading) {
    return <p className="text-center mt-5">Cargando datos...</p>;
  }

  // Render error
  if (error || meetingsError) {
    return (
      <p className="text-center mt-5 text-red-500">
        {error || meetingsError}
      </p>
    );
  }

  // Si ya se borró o no existe
  if (!project) {
    if (deleteSuccessMsg) {
      return (
        <div className="p-4">
          <p className="text-green-600 font-bold">{deleteSuccessMsg}</p>
        </div>
      );
    }
    return <p className="text-center mt-5">Proyecto no encontrado</p>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center gap-4 bg-background text-text p-4">
      {/* Mensajes de éxito */}
      {deleteSuccessMsg && (
        <p className="text-green-600 font-bold">{deleteSuccessMsg}</p>
      )}
      {updateSuccessMsg && (
        <p className="text-green-600 font-bold">{updateSuccessMsg}</p>
      )}

      {/* ---------------- SECCIÓN A: DETALLE DEL PROYECTO ---------------- */}
      {isEditing ? (
        <div className="w-full max-w-md border p-4 rounded shadow bg-background">
          <label className="block mb-2 font-semibold">Título:</label>
          <input
            className="border w-full mb-4 p-2 rounded text-black"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />

          <label className="block mb-2 font-semibold">Cliente:</label>
          <input
            className="border w-full mb-4 p-2 rounded text-black"
            name="client"
            value={formData.client}
            onChange={handleChange}
          />

          <label className="block mb-2 font-semibold">Descripción:</label>
          <textarea
            className="border w-full mb-4 p-2 rounded text-black"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />

          <label className="block mb-2 font-semibold">Estado:</label>
          <select
            className="border w-full mb-4 p-2 rounded text-black"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="pending">pending</option>
            <option value="approved">approved</option>
            <option value="rejected">rejected</option>
          </select>

          {/* Botones guardar / cancelar */}
          <div className="flex gap-4 mt-4">
            <button
              className="bg-primary text-background px-4 py-2 rounded"
              onClick={handleSaveEdit}
            >
              Guardar
            </button>
            <button
              className="bg-danger text-background px-4 py-2 rounded"
              onClick={handleCancelEdit}
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-background p-6 rounded-xl shadow-md max-w-md w-full">
          <h1 className="text-3xl font-extrabold mb-4">{project.title}</h1>
          <p className="mb-1">
            <strong>Cliente:</strong> {project.client}
          </p>
          <p className="mb-1">
            <strong>Descripción:</strong> {project.description}
          </p>
          <p className="mb-1">
            <strong>Estado:</strong> {project.status}
          </p>
          <p className="mb-1">
            <strong>Created At:</strong>{" "}
            {new Date(project.createdAt).toLocaleDateString()}
          </p>
          <p className="mb-1">
            <strong>Updated At:</strong>{" "}
            {new Date(project.updatedAt).toLocaleDateString()}
          </p>

          <div className="flex flex-wrap gap-4 mt-4">
            <button
              className="bg-primary text-background px-4 py-2 rounded"
              onClick={handleEdit}
            >
              Editar
            </button>
            <button
              className="bg-danger text-background px-4 py-2 rounded"
              onClick={() => setShowDeleteModal(true)}
            >
              Eliminar
            </button>
            <RequirementModal triggerButtonText="Create Meeting"></RequirementModal>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN DE ELIMINAR */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar proyecto?"
        message="¿Estás seguro de que deseas eliminar este proyecto?"
      />

      {/* ---------------- SECCIÓN B: LISTA DE REUNIONES ---------------- */}
      <div className="bg-background p-6 rounded-xl shadow-md max-w-2xl w-full mt-8">
        <h2 className="text-2xl font-bold mb-4">Reuniones</h2>
        {projectMeetings.length === 0 ? (
          <p>No hay reuniones registradas para este proyecto</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projectMeetings.map((meeting: Meeting) => (
              <Link key={meeting.id} href={`/meetings/${meeting.id}`}>
                <div className="border p-4 rounded shadow-sm hover:shadow-md transition cursor-pointer">
                  <h3 className="font-semibold text-lg">{meeting.title}</h3>
                  <p className="text-sm mb-1">
                    <strong>Fecha:</strong>{" "}
                    {new Date(meeting.date).toLocaleString()}
                  </p>
                  <p className="text-sm mb-1">
                    <strong>Descripción:</strong> {meeting.description}
                  </p>
                  {meeting.audioId ? (
                    <p className="text-sm text-green-800">
                      <strong>Audio Subido:</strong> {meeting.audioId}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-600">
                      <em>Sin audio</em>
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;