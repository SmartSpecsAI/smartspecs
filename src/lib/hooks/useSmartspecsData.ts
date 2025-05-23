import { useEffect } from "react";
import {
  useProjects,
  useProjectsData,
  useRequirementsData,
} from "@/smartspecs/lib/presentation";
import { Project } from "@/smartspecs/lib/domain";

export function useSmartspecsData() {
  const {
    projects,
    selectedProject,
    updateSelectedProject,
    isLoading: projectsLoading,
    error: projectsError,
  } = useProjectsData();

  const {
    requirements,
    isLoading: requirementsLoading,
    error: requirementsError,
    refetch: refetchRequirements,
  } = useRequirementsData();

  const handleRefresh = async () => {
    await Promise.all([refetchRequirements()]);
  };

  useEffect(() => {
    if (projects[0]) {
      updateSelectedProject(projects[0] as unknown as Project);
    }
  }, [projects]);

  return {
    projects,
    selectedProject,
    updateSelectedProject,
    projectsLoading,
    projectsError,
    requirements,
    requirementsLoading,
    requirementsError,
    handleRefresh,
  };
}
