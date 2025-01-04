"use client";
import { useEffect, useState } from "react";
import { useProjects } from "../contexts/ProjectsContext";
import { getInjection } from "@/di/container";

export function useProjectsData() {
  const { projects, setProjects, setSelectedProject } = useProjects();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const getAllProjectsUseCase = getInjection("IGetAllProjectsUseCase");

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const projectsData = await getAllProjectsUseCase.execute();
        setProjects(projectsData);
        console.log("projectsData::", projectsData);
        if (projectsData.length > 0) {
          setSelectedProject(projectsData[0]);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch projects"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [setProjects, setSelectedProject]);

  return { projects, isLoading, error };
}
