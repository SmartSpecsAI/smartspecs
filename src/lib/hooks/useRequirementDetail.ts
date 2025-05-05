import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useRequirementsData } from "@/smartspecs/lib/presentation";
import { Requirement, RequirementItem } from "@/smartspecs/lib/domain";
import { RequirementAdapter } from "@/smartspecs/lib/adapters/RequirementAdapter";

export function useRequirementDetail() {
  const params = useParams();
  const [isEditMode, setIsEditMode] = useState(false);
  const {
    getRequirementById,
    updateRequirement,
    approveRequirement,
    rejectRequirement,
    isLoading,
    error,
  } = useRequirementsData();
  const [requirement, setRequirement] = useState<Requirement | null>(null);
  const [editedItems, setEditedItems] = useState<RequirementItem[]>([]);
  const [editedDescription, setEditedDescription] = useState<string>("");

  useEffect(() => {
    const fetchRequirement = async () => {
      if (params.slug) {
        const data = await getRequirementById(params.slug as string) as unknown as Requirement;
        setRequirement(data);
        setEditedDescription(data?.description || "");
        setEditedItems(data?.items || []);
      }
    };
    fetchRequirement();
  }, [params.slug]);

  const handleEditToggle = async () => {
    if (isEditMode) {
      const updatedRequirement: Requirement = {
        ...requirement!,
        description: editedDescription,
        items: editedItems,
      };
      setRequirement(updatedRequirement);
      await updateRequirement(updatedRequirement);
    }
    setIsEditMode(!isEditMode);
  };

  const handleItemChange = (index: number, field: string, value: string) => {
    const newItems = [...editedItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setEditedItems(newItems);
  };

  const handleActionItemChange = (
    itemIndex: number,
    actionIndex: number,
    value: string
  ) => {
    const newItems = [...editedItems];
    newItems[itemIndex].action_items[actionIndex] = value;
    setEditedItems(newItems);
  };

  const handleApprove = async () => {
    const appRequirement = await approveRequirement(requirement!.id);
    if (!appRequirement) return;
    setRequirement(RequirementAdapter.toDomain(appRequirement));
  };

  const handleReject = async () => {
    const appRequirement = await rejectRequirement(requirement!.id);
    if (!appRequirement) return;
    setRequirement(RequirementAdapter.toDomain(appRequirement));
  };

  return {
    isEditMode,
    setIsEditMode,
    requirement,
    editedItems,
    editedDescription,
    setEditedDescription,
    isLoading,
    error,
    handleEditToggle,
    handleItemChange,
    handleActionItemChange,
    handleApprove,
    handleReject,
  };
} 