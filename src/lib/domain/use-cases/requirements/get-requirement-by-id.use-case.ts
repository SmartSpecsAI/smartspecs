import { Requirement } from "../../entities";
import { IRequirementRepository } from "@/smartspecs/lib/domain/repositories";

export const GetRequirementByIdUseCase = (
  requirementRepository: IRequirementRepository
) => ({
  async execute(projectId: string, id: string): Promise<Requirement | null> {
    try {
      return await requirementRepository.getById(projectId, id);
    } catch (error) {
      console.error("Error getting requirements by project:", error);
      throw new Error(
        "Failed to get requirements by project. Please try again later."
      );
    }
  },
});

export type IGetRequirementByIdUseCase = ReturnType<
  typeof GetRequirementByIdUseCase
>;
