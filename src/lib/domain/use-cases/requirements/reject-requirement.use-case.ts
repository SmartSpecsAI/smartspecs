import { IRequirementRepository } from "@/smartspecs/lib/domain/repositories";
import { Requirement, Status } from "@/smartspecs/lib/domain/entities";
import { UpdateRequirementUseCase } from "@/smartspecs/lib/domain/use-cases/requirements/update-requirement.use-case";

export const RejectRequirementUseCase = (
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

        const updatedData = { ...requirement, status: Status.REJECTED };
        const updatedRequirement = await updateRequirement.execute(
          projectId,
          updatedData
        );
        return updatedRequirement;
      } catch (error) {
        console.error("Error rejecting requirement:", error);
        throw new Error(
          "Failed to reject requirement. Please try again later."
        );
      }
    },
  };
};

export type IRejectRequirementUseCase = ReturnType<
  typeof RejectRequirementUseCase
>;
