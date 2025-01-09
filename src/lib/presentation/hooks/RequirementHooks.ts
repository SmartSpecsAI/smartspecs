"use client";
import { useEffect, useState } from "react";
import { useProjects } from "../contexts/ProjectsContext";
import { getInjection } from "@/di/container";
import { Requirement } from "@/lib/domain";
import { useRequirements } from "../contexts";

export function useRequirementsData() {
  const getAllRequirementsByProjectUseCase = getInjection(
    "IGetAllRequirementsByProjectUseCase"
  );
  const createRequirementUseCase = getInjection("ICreateNewRequirementUseCase");
  const { selectedProject } = useProjects();

  const { requirements, setRequirements } = useRequirements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequirements = async () => {
      if (!selectedProject) return;
      setIsLoading(true);
      setError(null);
      try {
        const requirementsData =
          await getAllRequirementsByProjectUseCase.execute(selectedProject.id);
        setRequirements(requirementsData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch requirements"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequirements();
  }, [selectedProject]);

  const createRequirement = async (requirement: Omit<Requirement, "id">) => {
    if (!selectedProject) return;
    setIsLoading(true);
    setError(null);
    try {
      const newRequirement = await createRequirementUseCase.execute(
        requirement
      );
      const updatedRequirements = [...requirements, newRequirement];
      console.log("Updated requirements:", updatedRequirements);
      setRequirements(updatedRequirements);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create requirement"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { requirements, setRequirements, isLoading, error, createRequirement };
}
