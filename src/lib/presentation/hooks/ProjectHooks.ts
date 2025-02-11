"use client";
import { useEffect, useState } from "react";
import { getInjection } from "@/smartspecs/di/container";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { setProjects, setSelectedProject } from '../store/projectsSlice';
import { Project } from "@/smartspecs/lib/domain";

export function useProjectsData() {
  const dispatch = useDispatch();
  const { projects, selectedProject } = useSelector((state: RootState) => ({
    projects: state.projects.projects,
    selectedProject: state.projects.selectedProject,
  }));
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const getAllProjectsUseCase = getInjection("IGetAllProjectsUseCase");

  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const projectsData = await getAllProjectsUseCase.execute();
      dispatch(setProjects(projectsData));
      if (projectsData.length > 0) {
        dispatch(setSelectedProject(projectsData[0]));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch projects");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoading || projects.length > 0) return;
    fetchProjects();
  }, [isLoading, projects]);

  return {
    projects,
    setSelectedProject: (project: Project) => dispatch(setSelectedProject(project)),
    selectedProject,
    isLoading,
    error,
    refetch: fetchProjects,
  };
}
