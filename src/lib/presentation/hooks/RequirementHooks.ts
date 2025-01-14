"use client";
import { useEffect, useState } from "react";
import { useProjects } from "../contexts/ProjectsContext";
import { getInjection } from "@/smartspecs/di/container";
import { Requirement } from "@/smartspecs/lib/domain";
import { useRequirements } from "../contexts";
import { get } from "http";

export function useRequirementsData() {
  const getAllRequirementsByProjectUseCase = getInjection(
    "IGetAllRequirementsByProjectUseCase"
  );

  const createRequirementUseCase = getInjection("ICreateNewRequirementUseCase");
  const generateRequirementItemsFromConversation = getInjection(
    "IGenerateRequirementItemsFromConversation"
  );
  const getRequirementByIdUseCase = getInjection("IGetRequirementByIdUseCase");
  const { selectedProject } = useProjects();

  const { requirements, setRequirements } = useRequirements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRequirement, setSelectedRequirement] =
    useState<Requirement | null>(null);

  const fetchRequirements = async () => {
    if (!selectedProject) return;
    setIsLoading(true);
    setError(null);
    try {
      const requirementsData = await getAllRequirementsByProjectUseCase.execute(
        selectedProject.id
      );
      setRequirements(requirementsData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch requirements"
      );
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchRequirements();
  }, [selectedProject]);

  const getRequirementById = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      let requirement = requirements.find((req) => req.id === id);
      if (!requirement) {
        if (!selectedProject) throw new Error("Requirement not found");
        const result = await getRequirementByIdUseCase.execute(
          selectedProject!.id,
          id
        );
        if (result) {
          requirement = result;
        } else {
          throw new Error("Requirement not found");
        }
      }
      setSelectedRequirement(requirement);
      return requirement;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch requirement"
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createRequirement = async (requirement: Omit<Requirement, "id">) => {
    if (!selectedProject) return;
    setIsLoading(true);
    setError(null);
    try {
      const newRequirement = await createRequirementUseCase.execute(
        requirement
      );
      const updatedRequirements = [...requirements, newRequirement];
      setRequirements(updatedRequirements);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create requirement"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getRequirementAnalysis = async (
    conversation: string
  ): Promise<Requirement> =>
    await generateRequirementItemsFromConversation.execute(conversation);

  return {
    requirements,
    setRequirements,
    selectedRequirement,
    isLoading,
    error,
    createRequirement,
    getRequirementById,
    getRequirementAnalysis,
    refetch: fetchRequirements,
  };
}
