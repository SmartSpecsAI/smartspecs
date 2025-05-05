"use client";
import { useEffect, useState } from "react";
import { useProjects } from "../slides/ProjectsSlide";
import { getInjection } from "@/smartspecs/di/container";
import { Requirement as DomainRequirement } from "@/smartspecs/lib/domain";
import { useRequirements } from "../slides";
import { RequirementAdapter } from "@/smartspecs/lib/adapters/RequirementAdapter";
import { Requirement as AppRequirement } from "@/smartspecs/app-lib/interfaces/requirement";

export function useRequirementsData() {
  const getAllRequirementsByProjectUseCase = getInjection(
    "IGetAllRequirementsByProjectUseCase"
  );

  const createRequirementUseCase = getInjection("ICreateNewRequirementUseCase");
  const generateRequirementItemsFromConversation = getInjection(
    "IGenerateRequirementItemsFromConversation"
  );
  const getRequirementByIdUseCase = getInjection("IGetRequirementByIdUseCase");
  const updateRequirementUseCase = getInjection("IUpdateRequirementUseCase");
  const approveRequirementUseCase = getInjection("IApproveRequirementUseCase");
  const rejectRequirementUseCase = getInjection("IRejectRequirementUseCase");
  const { selectedProject } = useProjects();

  const { requirements: appRequirements, updateRequirements } = useRequirements();
  const [error, setError] = useState<string | null>(null);
  const [selectedRequirement, setSelectedRequirement] =
    useState<DomainRequirement | null>(null);

  // Initialize loading map
  const [loadingMap, setLoadingMap] = useState({
    fetchRequirements: false,
    getRequirementById: false,
    createRequirement: false,
    updateRequirement: false,
    approveRequirement: false,
    rejectRequirement: false,
  });

  const fetchRequirements = async () => {
    if (!selectedProject) return;
    setLoadingMap((prev) => ({ ...prev, fetchRequirements: true }));
    setError(null);
    try {
      const requirementsData = await getAllRequirementsByProjectUseCase.execute(
        selectedProject.id
      );
      updateRequirements(requirementsData.map(RequirementAdapter.toApp));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch requirements"
      );
    } finally {
      setLoadingMap((prev) => ({ ...prev, fetchRequirements: false }));
    }
  };
  useEffect(() => {
    fetchRequirements();
  }, [selectedProject]);

  const getRequirementById = async (id: string) => {
    setLoadingMap((prev) => ({ ...prev, getRequirementById: true }));
    setError(null);
    try {
      let requirement = appRequirements.find((req) => req.id === id);
      if (!requirement) {
        if (!selectedProject) throw new Error("Requirement not found");
        const result = await getRequirementByIdUseCase.execute(
          selectedProject!.id,
          id
        );
        if (result) {
          requirement = RequirementAdapter.toApp(result);
        } else {
          throw new Error("Requirement not found");
        }
      }
      const domainRequirement = RequirementAdapter.toDomain(requirement);
      setSelectedRequirement(domainRequirement);
      return domainRequirement;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch requirement"
      );
      return null;
    } finally {
      setLoadingMap((prev) => ({ ...prev, getRequirementById: false }));
    }
  };

  const createRequirement = async (requirement: Omit<DomainRequirement, "id">) => {
    if (!selectedProject) return;
    setLoadingMap((prev) => ({ ...prev, createRequirement: true }));
    setError(null);
    try {
      const newRequirement = await createRequirementUseCase.execute(
        requirement
      );
      const updatedRequirements = [...appRequirements, RequirementAdapter.toApp(newRequirement)];
      updateRequirements(updatedRequirements);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create requirement"
      );
    } finally {
      setLoadingMap((prev) => ({ ...prev, createRequirement: false }));
    }
  };

  const updateRequirement = async (updatedData: DomainRequirement) => {
    setLoadingMap((prev) => ({ ...prev, updateRequirement: true }));
    setError(null);
    try {
      const id = updatedData.id;
      const projectId = selectedProject?.id;
      if (!id || !projectId) return;
      const updatedRequirement = await updateRequirementUseCase.execute(
        projectId,
        updatedData
      );
      const updatedRequirements = appRequirements.map((req) =>
        req.id === id ? RequirementAdapter.toApp(updatedRequirement) : req
      );
      updateRequirements(updatedRequirements);
      setSelectedRequirement(updatedRequirement);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update requirement"
      );
    } finally {
      setLoadingMap((prev) => ({ ...prev, updateRequirement: false }));
    }
  };

  const approveRequirement = async (requirementId: string) => {
    setLoadingMap((prev) => ({ ...prev, approveRequirement: true }));
    setError(null);
    try {
      if (!selectedProject) return;
      const approvedRequirement = await approveRequirementUseCase.execute(
        selectedProject.id,
        requirementId
      );
      const updatedRequirements = appRequirements.map((req) =>
        req.id === requirementId ? RequirementAdapter.toApp(approvedRequirement) : req
      );
      updateRequirements(updatedRequirements);
      setSelectedRequirement(approvedRequirement);
      return updatedRequirements.find((req) => req.id === requirementId);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to approve requirement"
      );
    } finally {
      setLoadingMap((prev) => ({ ...prev, approveRequirement: false }));
    }
  };

  const rejectRequirement = async (requirementId: string) => {
    setLoadingMap((prev) => ({ ...prev, rejectRequirement: true }));
    setError(null);
    try {
      if (!selectedProject) return;
      const rejectedRequirement = await rejectRequirementUseCase.execute(
        selectedProject.id,
        requirementId
      );
      const updatedRequirements = appRequirements.map((req) =>
        req.id === requirementId ? RequirementAdapter.toApp(rejectedRequirement) : req
      );
      updateRequirements(updatedRequirements);
      setSelectedRequirement(rejectedRequirement);
      return updatedRequirements.find((req) => req.id === requirementId);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to reject requirement"
      );
    } finally {
      setLoadingMap((prev) => ({ ...prev, rejectRequirement: false }));
    }
  };

  const getRequirementAnalysis = async (
    conversation: string
  ): Promise<DomainRequirement> =>
    await generateRequirementItemsFromConversation.execute(conversation);

  const isLoadingObject = (id: keyof typeof loadingMap): boolean => {
    return loadingMap[id];
  };

  return {
    requirements: appRequirements.map(RequirementAdapter.toDomain),
    selectedRequirement,
    isLoading: loadingMap.fetchRequirements, // Return fetchRequirements loader as default
    isLoadingObject,
    error,
    createRequirement,
    getRequirementById,
    updateRequirement,
    approveRequirement,
    rejectRequirement,
    getRequirementAnalysis,
    refetch: fetchRequirements,
  };
}
