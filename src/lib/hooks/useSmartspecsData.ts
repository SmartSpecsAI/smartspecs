import { useEffect } from "react";
import { useProjectsData, useRequirementsData } from "@/smartspecs/lib/presentation";

export function useSmartspecsData() {
  const {
    projects,
    selectedProject,
    setSelectedProject,
    isLoading: projectsLoading,
    error: projectsError,
    refetch: refetchProjects,
  } = useProjectsData();

  const {
    requirements,
    isLoading: requirementsLoading,
    error: requirementsError,
    refetch: refetchRequirements,
  } = useRequirementsData();

  const handleRefresh = async () => {
    await Promise.all([refetchProjects(), refetchRequirements()]);
  };

  useEffect(() => {
    if (projects[0]) {
      setSelectedProject(projects[0]);
    }
  }, [projects]);

  return {
    projects,
    selectedProject,
    setSelectedProject,
    projectsLoading,
    projectsError,
    requirements,
    requirementsLoading,
    requirementsError,
    handleRefresh,
  };
} 