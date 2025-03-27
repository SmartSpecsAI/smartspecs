import React, { useState } from "react";
import { useAppDispatch } from "./CreateMeetingModal";
import { updateProject } from "@/smartspecs/lib/presentation/redux/slices/ProjectsSlice";

interface ProjectFormProps {
  project: {
    id: string;
    title: string;
    client: string;
    description: string;
    status: "pending" | "approved" | "rejected";
    createdAt: string;
    updatedAt: string;
  };
  onCancel: () => void;
  onSaveSuccess: (message: string) => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onCancel, onSaveSuccess }) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    title: project.title,
    client: project.client,
    description: project.description,
    status: project.status,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async () => {
    setIsLoading(true);
    const now = new Date().toISOString();
    const updatedData = {
      ...formData,
      updatedAt: now,
    };
    await dispatch(updateProject({ id: project.id, updatedData }));
    setIsLoading(false);
    onSaveSuccess("¡Proyecto actualizado con éxito!");
  };

  return (
    <div className="w-full border p-4 rounded shadow bg-background">
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

      {/* <label className="block mb-2 font-semibold">Estado:</label>
      <select
        className="border w-full mb-4 p-2 rounded text-black"
        name="status"
        value={formData.status}
        onChange={handleChange}
      >
        <option value="pending">pending</option>
        <option value="approved">approved</option>
        <option value="rejected">rejected</option>
      </select> */}

      <div className="flex gap-4 mt-4">
        <button
          className="bg-primary text-background px-4 py-2 rounded"
          onClick={handleSaveEdit}
          disabled={isLoading}
        >
          {isLoading ? "Guardando..." : "Guardar"}
        </button>
        <button
          className={`bg-danger text-background px-4 py-2 rounded ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default ProjectForm; 