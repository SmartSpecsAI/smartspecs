import { Requirement } from "@/smartspecs/domain";
import { IRequirementRepository } from "@/smartspecs/domain/repositories";

export const CreateNewRequirementUseCase = (
  requirementRepository: IRequirementRepository
) => ({
  async execute(requirement: Omit<Requirement, "id">): Promise<Requirement> {
    try {
      return await requirementRepository.create(requirement);
    } catch (error) {
      console.error("Error creating new requirement:", error);
      throw new Error(
        "Failed to create new requirement. Please try again later."
      );
    }
  },
});

export type ICreateNewRequirementUseCase = ReturnType<
  typeof CreateNewRequirementUseCase
>;
