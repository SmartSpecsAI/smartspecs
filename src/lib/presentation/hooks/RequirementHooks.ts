"use client";
import { useEffect, useState } from "react";
import { useProjects } from "../contexts/ProjectsContext";
import { getInjection } from "@/di/container";
import { Requirement } from "@/lib/domain";

export function useRequirementsData() {
  const { selectedProject } = useProjects();
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const getAllRequirementsByProjectUseCase = getInjection(
    "IGetAllRequirementsByProjectUseCase"
  );

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

  return { requirements, isLoading, error };
}
