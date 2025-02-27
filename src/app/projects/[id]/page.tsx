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
import { usePathname } from "next/navigation";

// Hooks tipados
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
const useAppDispatch = () => useDispatch<AppDispatch>();

// Modal genérico
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

const ProjectDetail: React.FC = () => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  // Estado local para edición y modal
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteSuccessMsg, setDeleteSuccessMsg] = useState("");
  const [updateSuccessMsg, setUpdateSuccessMsg] = useState("");

  // Guardamos temporalmente la data del proyecto mientras editamos
  const [formData, setFormData] = useState<Omit<Project, "id">>({
    title: "",
    client: "",
    description: "",
    status: "pending",
    createdAt: "",
    updatedAt: "",
  });

  const id = pathname ? pathname.split("/").pop() : null;
  const { projects, loading, error } = useAppSelector((state) => state.projects);

  // Buscamos el proyecto en el store
  const project = projects.find((p: Project) => p.id === id);

  // Si no está, lo traemos de Firestore
  useEffect(() => {
    if (id && !project) {
      dispatch(fetchProjectById(id));
    }
  }, [id, project, dispatch]);

  // Cada vez que cambie el proyecto y entres a modo edición, actualiza formData
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

  // Función para confirmar borrado
  const handleConfirmDelete = async () => {
    if (!project) return;
    await dispatch(deleteProject(project.id));
    setShowDeleteModal(false);
    setDeleteSuccessMsg("¡Proyecto eliminado con éxito!");
  };

  // Función para iniciar edición
  const handleEdit = () => {
    setIsEditing(true);
    setUpdateSuccessMsg("");
    setDeleteSuccessMsg("");
  };

  // Función para cancelar edición
  const handleCancelEdit = () => {
    setIsEditing(false);
    setUpdateSuccessMsg("");
    setDeleteSuccessMsg("");
  };

  // Función para guardar cambios
  const handleSaveEdit = async () => {
    if (!project) return;
    // Actualizamos la fecha
    const now = new Date().toISOString();
    const updatedData = {
      ...formData,
      updatedAt: now,
    };
    // Hacemos dispatch a la acción de updateProject
    await dispatch(updateProject({ id: project.id, updatedData }));
    setIsEditing(false);
    setUpdateSuccessMsg("¡Proyecto actualizado con éxito!");
  };

  // Manejador para inputs en modo edición
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <p className="text-center mt-5">Cargando proyecto...</p>;
  }

  if (error) {
    return <p className="text-center mt-5 text-red-500">{error}</p>;
  }

  if (!project) {
    // Si ya se eliminó, podemos mostrar el mensaje de éxito
    if (deleteSuccessMsg) {
      return (
        <div className="p-4">
          <p className="text-green-600 font-bold">{deleteSuccessMsg}</p>
        </div>
      );
    }
    return <p className="text-center mt-5">Proyecto no encontrado</p>;
  }

  // Si el proyecto aún existe, pero se eliminó en la BD, en teoría ya no vendría en la lista
  // pero asumiremos que se mantiene en store hasta recargar.

  return (
    <div className="min-h-screen flex flex-col items-center gap-4 bg-background text-text p-4">
      {/* Mensajes de éxito */}
      {deleteSuccessMsg && (
        <p className="text-green-600 font-bold">{deleteSuccessMsg}</p>
      )}
      {updateSuccessMsg && (
        <p className="text-green-600 font-bold">{updateSuccessMsg}</p>
      )}

      {isEditing ? (
        // ---------------------- MODO EDICIÓN ----------------------
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
            onChange={(e) => handleChange(e as unknown as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)}
          >
            <option value="pending">pending</option>
            <option value="approved">approved</option>
            <option value="rejected">rejected</option>
          </select>
          {/* Botones de Guardar / Cancelar */}
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
        // ---------------------- MODO LECTURA ----------------------
        <div className="bg-background p-6 rounded-xl shadow-md max-w-md w-full">
          <h1 className="text-3xl font-extrabold mb-4">{project.title}</h1>
          <p className="mb-1">
            <strong>Client:</strong> {project.client}
          </p>
          <p className="mb-1">
            <strong>Description:</strong> {project.description}
          </p>
          <p className="mb-1">
            <strong>Status:</strong> {project.status}
          </p>
          <p className="mb-1">
            <strong>Created At:</strong>{" "}
            {new Date(project.createdAt).toLocaleDateString()}
          </p>
          <p className="mb-1">
            <strong>Updated At:</strong>{" "}
            {new Date(project.updatedAt).toLocaleDateString()}
          </p>
          <div className="flex gap-4 mt-4">
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
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminar */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar proyecto?"
        message="¿Estás seguro de que deseas eliminar este proyecto?"
      />
    </div>
  );
};

export default ProjectDetail;