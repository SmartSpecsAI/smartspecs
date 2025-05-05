// src/app-lib/components/forms/ProjectForm.tsx

import React from "react";
import { Project } from "@/smartspecs/app-lib/interfaces/project";
import { useProjectForm } from "@/smartspecs/app-lib/hooks/projects/useProjectForm";

interface ProjectFormProps {
  onCancel: () => void;
  project?: Project;
  onSaveSuccess?: (message: string) => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onCancel, project, onSaveSuccess }) => {
  const { formData, handleInputChange, handleSubmit } = useProjectForm({
    project,
    onSaveSuccess,
    onCancel,
  });

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