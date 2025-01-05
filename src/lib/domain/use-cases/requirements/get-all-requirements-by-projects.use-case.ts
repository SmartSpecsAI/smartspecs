import { Requirement } from "../../entities";
import { IRequirementRepository } from "@/smartspecs/domain/repositories";

export const GetAllRequirementsByProjectUseCase = (
  requirementRepository: IRequirementRepository
) => ({
  async execute(projectId: string): Promise<Requirement[]> {
    try {
      return await requirementRepository.getAllById(projectId);
    } catch (error) {
      console.error("Error getting requirements by project:", error);
      throw new Error(
        "Failed to get requirements by project. Please try again later."
      );
    }
  },
});

export type IGetAllRequirementsByProjectUseCase = ReturnType<
  typeof GetAllRequirementsByProjectUseCase
>;
