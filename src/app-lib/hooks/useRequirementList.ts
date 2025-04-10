import { useState } from 'react';
import { deleteRequirement, Requirement, updateRequirement } from '@/smartspecs/app-lib/redux/slices/RequirementsSlice';
import { useAppDispatch } from './useAppDispatch';

export const useRequirementList = () => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempTitle, setTempTitle] = useState("");
  const [tempDescription, setTempDescription] = useState("");
  const [tempPriority, setTempPriority] = useState<"low" | "medium" | "high">("medium");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const dispatch = useAppDispatch();

  const handleEditClick = (req: Requirement) => {
    if (editingId === req.id) {
      dispatch(
        updateRequirement({
          id: req.id,
          updatedData: {
            title: tempTitle,
            description: tempDescription,
            priority: tempPriority,
          },
        })
      );
      setEditingId(null);
    } else {
      setEditingId(req.id);
      setTempTitle(req.title);
      setTempDescription(req.description);
      setTempPriority(req.priority);
    }
  };

  const handleDeleteClick = (reqId: string) => {
    setDeleteId(reqId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    dispatch(deleteRequirement(deleteId));
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  return {
    editingId,
    tempTitle,
    tempDescription,
    tempPriority,
    showDeleteModal,
    setTempTitle,
    setTempDescription,
    setTempPriority,
    handleEditClick,
    handleDeleteClick,
    confirmDelete,
    cancelDelete,
  };
}; 