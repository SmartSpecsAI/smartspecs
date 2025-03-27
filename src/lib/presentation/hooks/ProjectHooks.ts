"use client";
import { useEffect, useState } from "react";
import { useProjects } from "../slides/ProjectsSlide";
import { getInjection } from "@/smartspecs/di/container";

export function useProjectsData() {
  const { projects, updateProjects, updateSelectedProject, selectedProject } =
    useProjects();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const getAllProjectsUseCase = getInjection("IGetAllProjectsUseCase");

  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const projectsData = await getAllProjectsUseCase.execute();
      updateProjects(projectsData);
      if (projectsData.length > 0) {
        updateSelectedProject(projectsData[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch projects");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoading || projects.length > 0) return;
    const fetch = async () => {
      await fetchProjects();
    };
    fetch();
  }, [isLoading, projects, updateProjects, updateSelectedProject]);

  return {
    projects,
    updateSelectedProject,
    selectedProject,
    isLoading,
    error,
    refetch: fetchProjects,
  };
}
