import { useProjects } from "../slides/ProjectsSlide";
import { Project as DomainProject } from "@/smartspecs/lib/domain";

export const useProjectsData = () => {
  const { projects, selectedProject, updateProjects, updateSelectedProject } = useProjects();

  return {
    projects,
    selectedProject,
    updateProjects,
    updateSelectedProject,
  };
}; 