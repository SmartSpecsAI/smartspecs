import { Project } from "@/smartspecs/lib/domain/entities";
import { IProjectsRepository } from "@/smartspecs/lib/domain/repositories";

export const GetAllProjectsUseCase = (
  projectsRepository: IProjectsRepository
) => ({
  async execute(): Promise<Project[]> {
    try {
      return await projectsRepository.getAll();
    } catch (error) {
      console.error("Error getting all projects:", error);
      throw new Error("Failed to get projects. Please try again later.");
    }
  },
});

export type IGetAllProjectsUseCase = ReturnType<typeof GetAllProjectsUseCase>;
