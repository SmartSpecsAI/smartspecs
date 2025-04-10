import { useEffect, useState } from "react";
import { useSelector, TypedUseSelectorHook, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/smartspecs/app-lib/redux/store";
import {
  getProject,
  deleteProject,
} from "@/smartspecs/app-lib/redux/slices/ProjectsSlice";
import {
  getMeetingsByProject,
} from "@/smartspecs/app-lib/redux/slices/MeetingsSlice";
import {
  fetchRequirementsByProject,
} from "@/smartspecs/app-lib/redux/slices/RequirementsSlice";
import { usePathname } from "next/navigation";
import { Project } from "../interfaces/project";

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
const useAppDispatch = () => useDispatch<AppDispatch>();

export const useProjectDetail = () => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteSuccessMsg, setDeleteSuccessMsg] = useState("");
  const [updateSuccessMsg, setUpdateSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [isDeletingMeetings, setIsDeletingMeetings] = useState(false);

  const id = pathname ? pathname.split("/").pop() : null;

  const { projects, loading, error } = useAppSelector((state) => state.projects);
  const { meetings, loading: meetingsLoading, error: meetingsError } = useAppSelector((state) => state.meetings);
  const { requirements, loading: requirementsLoading, error: requirementsError } = useAppSelector((state) => state.requirements);

  const project = projects.find((p: Project) => p.id === id);

  useEffect(() => {
    if (id) {
      dispatch(getProject(id));
      dispatch(getMeetingsByProject(id));
      dispatch(fetchRequirementsByProject(id));
    }
  }, [id, dispatch]);

  // Add new effect to refresh requirements when meetings change
  useEffect(() => {
    if (id) {
      dispatch(fetchRequirementsByProject(id));
    }
  }, [meetings, id, dispatch]);

  const handleConfirmDelete = async () => {
    if (!project) return;
    setIsLoading(true);
    await dispatch(deleteProject(project.id));
    setIsLoading(false);
    setShowDeleteModal(false);
    setDeleteSuccessMsg("¡Proyecto eliminado con éxito!");
  };

  const handleEdit = () => {
    setIsEditing(true);
    setUpdateSuccessMsg("");
    setDeleteSuccessMsg("");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setUpdateSuccessMsg("");
    setDeleteSuccessMsg("");
  };

  const handleSaveSuccess = (message: string) => {
    setIsEditing(false);
    setUpdateSuccessMsg(message);
  };

  const projectMeetings = meetings.filter((m) => m.projectId === id);

  const handleDeleteAllMeetings = async () => {
    if (!id) return;
    try {
      setIsDeletingMeetings(true);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_LOCAL_BASE_URL}/meetings/clear`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al eliminar las reuniones');
      }

      // Refresh meetings list
      await dispatch(getMeetingsByProject(id));
      alert("✅ Todas las reuniones han sido eliminadas correctamente");
    } catch (error) {
      console.error("❌ Error eliminando reuniones:", error);
      alert("❌ Error al eliminar las reuniones");
    } finally {
      setIsDeletingMeetings(false);
    }
  };

  return {
    isEditing,
    showDeleteModal,
    deleteSuccessMsg,
    updateSuccessMsg,
    isLoading,
    showMeetingModal,
    setShowMeetingModal,
    project,
    projectMeetings,
    requirements,
    loading,
    meetingsLoading,
    requirementsLoading,
    error,
    meetingsError,
    requirementsError,
    handleConfirmDelete,
    handleEdit,
    handleCancelEdit,
    handleSaveSuccess,
    handleDeleteAllMeetings,
    isDeletingMeetings,
  };
};