import { IRequirementRepository } from "@/smartspecs/lib/domain/repositories";
import { Requirement } from "@/smartspecs/lib/domain/entities";

export const UpdateRequirementUseCase = (
  requirementRepository: IRequirementRepository
) => ({
  async execute(
    projectId: string,
    updatedData: Requirement
  ): Promise<Requirement> {
    try {
      const updatedRequirement = await requirementRepository.update(
        projectId,
        updatedData
      );
      return updatedRequirement;
    } catch (error) {
      console.error("Error updating requirement:", error);
      throw new Error("Failed to update requirement. Please try again later.");
    }
  },
});

export type IUpdateRequirementUseCase = ReturnType<
  typeof UpdateRequirementUseCase
>;
