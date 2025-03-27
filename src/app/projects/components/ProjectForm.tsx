import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/smartspecs/lib/presentation/redux/store";
import { createProject, Project } from "@/smartspecs/lib/presentation/redux/slices/ProjectsSlice";

const useAppDispatch = () => useDispatch<AppDispatch>();

const ProjectForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const [newProject, setNewProject] = useState<Omit<Project, "id">>({
    title: "",
    client: "",
    description: "",
    status: "pending",
    createdAt: "",
    updatedAt: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewProject({ ...newProject, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const timestamp = new Date().toISOString();
    dispatch(
      createProject({
        ...newProject,
        createdAt: timestamp,
        updatedAt: timestamp,
      })
    );
    setNewProject({
      title: "",
      client: "",
      description: "",
      status: "pending",
      createdAt: "",
      updatedAt: "",
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <input
        type="text"
        name="title"
        value={newProject.title}
        onChange={handleInputChange}
        placeholder="Project Title"
        className="border border-primary p-2 w-full mb-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        required
      />
      <input
        type="text"
        name="client"
        value={newProject.client}
        onChange={handleInputChange}
        placeholder="Client Name"
        className="border border-primary p-2 w-full mb-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        required
      />
      <textarea
        name="description"
        value={newProject.description}
        onChange={handleInputChange}
        placeholder="Project Description"
        className="border border-primary p-2 w-full mb-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        required
      />
      <button
        type="submit"
        className="bg-primary text-background hover:bg-primary/80 p-3 w-full rounded-lg shadow-md transition"
      >
        Create Project
      </button>
    </form>
  );
};

export default ProjectForm; 