'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { fetchProjects, createProject } from '../../lib/presentation/redux/slices/ProjectsSlice';
import { RootState } from '../../lib/presentation/redux/store';
import type { Project } from '../../lib/presentation/redux/slices/ProjectsSlice';
import { AppDispatch } from '../../lib/presentation/redux/store';

// Use Typed Dispatch and Selector
const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode }> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded shadow-lg w-full max-w-md">
        <button onClick={onClose} className="text-red-500 float-right">&times;</button>
        {children}
      </div>
    </div>
  );
};

const ProjectsView: React.FC = () => {
    const dispatch = useAppDispatch();
    const { projects, loading, error } = useAppSelector((state) => state.projects);
    const [newProject, setNewProject] = useState<Omit<Project, 'id'>>({
      title: '',
      client: '',
      description: '',
      status: 'pending',
      createdAt: '',
      updatedAt: '',
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setNewProject({ ...newProject, [name]: value });
    };
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const timestamp = new Date().toISOString();
      dispatch(createProject({ ...newProject, createdAt: timestamp, updatedAt: timestamp }));
      setNewProject({ title: '', client: '', description: '', status: 'pending', createdAt: '', updatedAt: '' });
      setIsModalOpen(false);
    };
  
    useEffect(() => {
      dispatch(fetchProjects());
    }, [dispatch]);
  
    // Evitar renderizar la lista hasta que los datos estén listos
    if (loading) return <p className="text-center mt-5">Loading projects...</p>;
  
    return (
      <div className="min-h-screen flex flex-col items-center gap-6 bg-background text-text">
        <h1 className="text-3xl font-extrabold mb-6">Projects</h1>
        {error && <p className="text-danger">{error}</p>}
        <button onClick={() => setIsModalOpen(true)} className="bg-primary text-background p-3 rounded-lg shadow-md hover:bg-secondary transition">Add New Project</button>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleSubmit} className="w-full">
            <input
              type="text"
              name="title"
              value={newProject.title}
              onChange={handleInputChange}
              placeholder="Project Title"
              className="border border-secondary p-2 w-full mb-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <input
              type="text"
              name="client"
              value={newProject.client}
              onChange={handleInputChange}
              placeholder="Client Name"
              className="border border-secondary p-2 w-full mb-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <textarea
              name="description"
              value={newProject.description}
              onChange={handleInputChange}
              placeholder="Project Description"
              className="border border-secondary p-2 w-full mb-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <button type="submit" className="bg-primary text-text p-3 w-full rounded-lg shadow-md hover:bg-secondary transition">Create Project</button>
          </form>
        </Modal>
        {projects.length === 0 ? (
          <p>No hay proyectos disponibles</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl">
            {projects.map((project: Project) => (
              <div key={project.id || 'unknown'} className="bg-background shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow border border-primary">
                <h2 className="font-semibold text-xl mb-2">{project.title}</h2>
                <p className="text-sm text-text mb-1"><strong>Client:</strong> {project.client}</p>
                <p className="text-sm text-text mb-1"><strong>Description:</strong> {project.description}</p>
                <p className="text-sm text-text mb-1"><strong>Status:</strong> {project.status}</p>
                <p className="text-sm text-text mb-1"><strong>Created At:</strong> {new Date(project.createdAt).toLocaleDateString()}</p>
                <p className="text-sm text-text"><strong>Updated At:</strong> {new Date(project.updatedAt).toLocaleDateString()}</p>
                <p className="text-sm text-text mb-1"><strong>ID:</strong> {project.id}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
export default ProjectsView; 