import { useState } from 'react';
import { deleteRequirement, updateRequirement } from '@/smartspecs/app-lib/redux/slices/RequirementsSlice';
import { useAppDispatch } from '@/smartspecs/app-lib/hooks/useAppDispatch';
import { Requirement, Status, Priority } from '@/smartspecs/app-lib/interfaces/requirement';
import { firestore } from '@/smartspecs/lib/config/firebase-settings';
import { doc, getDoc, collection, Timestamp, setDoc } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { RootState } from '@/smartspecs/app-lib/redux/store';

export const useRequirementList = () => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempTitle, setTempTitle] = useState("");
  const [tempDescription, setTempDescription] = useState("");
  const [tempPriority, setTempPriority] = useState<Priority>(Priority.MEDIUM);
  const [tempStatus, setTempStatus] = useState<Status>(Status.IN_PROGRESS);
  const [tempResponsible, setTempResponsible] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const dispatch = useAppDispatch();
  const { currentUser } = useSelector((state: RootState) => state.users);

  const handleEditClick = async (req: Requirement) => {
    if (editingId === req.id) {
      // Primero obtenemos el estado anterior del requerimiento para el historial
      const docRef = doc(firestore, "requirements", req.id);
      const snap = await getDoc(docRef);
      
      if (snap.exists()) {
        const previousData = snap.data();
        const previousState = {
          id: snap.id,
          projectId: previousData?.projectId || "",
          title: previousData?.title || "",
          description: previousData?.description || "",
          priority: previousData?.priority || Priority.MEDIUM,
          status: previousData?.status || Status.PENDING,
          responsible: previousData?.responsible || "",
          createdAt: previousData?.createdAt?.toDate().toISOString() || "",
          updatedAt: previousData?.updatedAt?.toDate().toISOString() || "",
        };
        
        // Actualizar el requerimiento
        dispatch(
          updateRequirement({
            id: req.id,
            updatedData: {
              title: tempTitle,
              description: tempDescription,
              priority: tempPriority as Priority,
              status: tempStatus,
              responsible: tempResponsible,
              origin: "Manual",
              reason: "Manual edit",
              updatedAt: new Date().toISOString(),
            },
          })
        );

        // Guardar historial
        const historyRef = doc(collection(firestore, "requirements", req.id, "history"));
        await setDoc(historyRef, {
          id: historyRef.id,
          requirementId: req.id,
          changedAt: Timestamp.now(),
          changedBy: currentUser?.name || "Unknown user",
          meetingId: "", // No hay meetingId en edición manual
          origin: "Manual",
          reason: "Manual edit",
          previousState,
          newState: {
            id: req.id,
            projectId: req.projectId,
            title: tempTitle,
            description: tempDescription,
            priority: tempPriority,
            status: tempStatus,
            responsible: tempResponsible,
            createdAt: req.createdAt,
            updatedAt: new Date().toISOString(),
          },
        });
      } else {
        // Si no existe el documento, simplemente actualizamos sin historial
        dispatch(
          updateRequirement({
            id: req.id,
            updatedData: {
              title: tempTitle,
              description: tempDescription,
              priority: tempPriority as Priority,
              status: tempStatus,
              responsible: tempResponsible,
              origin: "Manual",
              reason: "Manual edit",
              updatedAt: new Date().toISOString(),
            },
          })
        );
      }
      
      setEditingId(null);
    } else {
      setEditingId(req.id);
      setTempTitle(req.title);
      setTempDescription(req.description);
      setTempPriority(req.priority);
      setTempStatus(req.status);
      setTempResponsible(req.responsible || "");
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
    tempResponsible,
    showDeleteModal,
    setTempTitle,
    setTempDescription,
    setTempPriority,
    setTempStatus,
    setTempResponsible,
    handleEditClick,
    handleDeleteClick,
    confirmDelete,
    cancelDelete,
  };
}; 