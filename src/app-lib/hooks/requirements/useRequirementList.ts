import { useState } from 'react';
import { deleteRequirement, updateRequirement } from '@/smartspecs/app-lib/redux/slices/RequirementsSlice';
import { useAppDispatch } from '@/smartspecs/app-lib/hooks/useAppDispatch';
import { Requirement, Status, Priority } from '@/smartspecs/app-lib/interfaces/requirement';

export const useRequirementList = () => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempTitle, setTempTitle] = useState("");
  const [tempDescription, setTempDescription] = useState("");
  const [tempPriority, setTempPriority] = useState<Priority>(Priority.MEDIUM);
  const [tempStatus, setTempStatus] = useState<Status>(Status.IN_PROGRESS);
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
            priority: tempPriority as Priority,
            status: tempStatus,
          },
        })
      );
      setEditingId(null);
    } else {
      setEditingId(req.id);
      setTempTitle(req.title);
      setTempDescription(req.description);
      setTempPriority(req.priority);
      setTempStatus(req.status);
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
    tempStatus,
    showDeleteModal,
    setTempTitle,
    setTempDescription,
    setTempPriority,
    setTempStatus,
    handleEditClick,
    handleDeleteClick,
    confirmDelete,
    cancelDelete,
  };
}; 