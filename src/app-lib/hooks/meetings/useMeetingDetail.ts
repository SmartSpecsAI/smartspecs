import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import {
  getMeeting,
  deleteMeeting,
} from "@/smartspecs/app-lib/redux/slices/MeetingsSlice";
import { AppDispatch, RootState } from "@/smartspecs/app-lib/redux/store";

export const useMeetingDetail = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const meetingId = pathname ? pathname.split("/").pop() : null;

  const { meetings, loading, error } = useSelector(
    (state: RootState) => state.meetings
  );

  // Buscamos la reunión en el store
  const meeting = meetings.find((m) => m.id === meetingId);

  // Si no está en el store, la cargamos
  useEffect(() => {
    if (meetingId && !meeting) {
      dispatch(getMeeting(meetingId));
    }
  }, [meetingId, meeting, dispatch]);

  // Manejo de eliminar la reunión
  const handleConfirmDelete = async () => {
    if (!meeting) return;
    await dispatch(deleteMeeting(meeting.id));
    setShowDeleteModal(false);
    router.push("/projects"); // Redirige luego de eliminar
  };

  return {
    meeting,
    loading,
    error,
    isEditing,
    setIsEditing,
    showDeleteModal,
    setShowDeleteModal,
    handleConfirmDelete,
  };
};