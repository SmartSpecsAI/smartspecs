import { Requirement } from "@/smartspecs/lib/domain";
import { IRequirementRepository } from "@/smartspecs/lib/domain/repositories";
import { Timestamp } from "firebase/firestore";

export const CreateNewRequirementUseCase = (
  requirementRepository: IRequirementRepository
) => ({
  async execute(requirement: Omit<Requirement, "id">): Promise<Requirement> {
    try {
      const requirementWithDates = {
        ...requirement,
        status: "in_progress",
        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date()),
      };
      return await requirementRepository.create(requirementWithDates);
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
