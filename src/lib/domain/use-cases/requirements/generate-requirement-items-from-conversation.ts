import { CONVERSATION_ANALYSIS_PROMPT } from "@/smartspecs/lib/utils";
import { IRequirementRepository, Requirement } from "@/smartspecs/lib/domain";

export const GenerateRequirementItemsFromConversation = (
  requirementRepository: IRequirementRepository
) => ({
  async execute(conversation: string): Promise<Requirement> {
    try {
      const prompt = CONVERSATION_ANALYSIS_PROMPT.replace(
        "[TRANSCRIPT]",
        conversation
      );

      const completion = await requirementRepository.generateRequirementsItems(
        prompt
      );

      const parsedResponse = JSON.parse(completion) as Requirement;

      return parsedResponse;
    } catch (error) {
      console.error("Error generating requirement items:", error);
      throw new Error("Failed to generate requirement items from conversation");
    }
  },
});

export type IGenerateRequirementItemsFromConversation = ReturnType<
  typeof GenerateRequirementItemsFromConversation
>;
