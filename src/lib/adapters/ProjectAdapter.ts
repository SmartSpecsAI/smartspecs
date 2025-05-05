import { Project as DomainProject } from "@/smartspecs/lib/domain";
import { Project as ReduxProject } from "@/smartspecs/app-lib/redux/slices/ProjectsSlice";

export const ProjectAdapter = {
  toDomain: (project: ReduxProject): DomainProject => ({
    id: project.id,
    name: project.title,
    description: project.description,
    clientName: project.client,
    createdAt: new Date(project.createdAt),
    updatedAt: new Date(project.updatedAt),
  }),

  toRedux: (project: DomainProject): ReduxProject => ({
    id: project.id,
    title: project.name || "",
    description: project.description || "",
    client: project.clientName || "",
    createdAt: project.createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: project.updatedAt?.toISOString() || new Date().toISOString(),
  }),
}; 