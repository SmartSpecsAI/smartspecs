import { IRequirementRepository } from "@/smartspecs/lib/domain/repositories";
import { Requirement, Status } from "@/smartspecs/lib/domain/entities";
import { UpdateRequirementUseCase } from "@/smartspecs/lib/domain/use-cases/requirements/update-requirement.use-case";

export const ApproveRequirementUseCase = (
  requirementRepository: IRequirementRepository
) => {
  const updateRequirement = UpdateRequirementUseCase(requirementRepository);

  return {
    async execute(
      projectId: string,
      requirementId: string
    ): Promise<Requirement> {
      try {
        const requirement = await requirementRepository.getById(
          projectId,
          requirementId
        );
        if (!requirement) {
          throw new Error("Requirement not found");
        }

        const updatedData = { ...requirement, status: Status.DONE };
        const updatedRequirement = await updateRequirement.execute(
          projectId,
          updatedData
        );
        return updatedRequirement;
      } catch (error) {
        console.error("Error approving requirement:", error);
        throw new Error(
          "Failed to approve requirement. Please try again later."
        );
      }
    },
  };
};

export type IApproveRequirementUseCase = ReturnType<
  typeof ApproveRequirementUseCase
>;
