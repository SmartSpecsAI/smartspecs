import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/smartspecs/app-lib/redux/store";
import { createProject, updateProject } from "@/smartspecs/app-lib/redux/slices/ProjectsSlice";
import { Project } from "@/smartspecs/app-lib/interfaces/project";
const useAppDispatch = () => useDispatch<AppDispatch>();

interface ProjectFormProps {
  onCancel: () => void;
  project?: Project;
  onSaveSuccess?: (message: string) => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onCancel, project, onSaveSuccess }) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<Omit<Project, "id">>({
    title: "",
    client: "",
    description: "",
    createdAt: "",
    updatedAt: "",
  });

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        client: project.client,
        description: project.description,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      });
    }
  }, [project]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const timestamp = new Date().toISOString();
    
    if (project) {
      dispatch(updateProject({
        id: project.id,
        updatedData: {
          ...formData,
          updatedAt: timestamp,
        }
      }));
      onSaveSuccess?.("Proyecto actualizado exitosamente");
    } else {
      dispatch(createProject(formData));
      onSaveSuccess?.("Proyecto creado exitosamente");
    }
    
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleInputChange}
        placeholder="Project Title"
        className="border border-primary p-2 w-full mb-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        required
      />
      <input
        type="text"
        name="client"
        value={formData.client}
        onChange={handleInputChange}
        placeholder="Client Name"
        className="border border-primary p-2 w-full mb-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        required
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        placeholder="Project Description"
        className="border border-primary p-2 w-full mb-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        required
      />
      <button
        type="submit"
        className="bg-primary text-background hover:bg-primary/80 p-3 w-full rounded-lg shadow-md transition"
      >
        {project ? "Update Project" : "Create Project"}
      </button>
    </form>
  );
};

export default ProjectForm; 