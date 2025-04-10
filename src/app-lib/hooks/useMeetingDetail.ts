import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import {
  getMeeting,
  updateMeeting,
  deleteMeeting,
} from "@/smartspecs/app-lib/redux/slices/MeetingsSlice";
import { AppDispatch, RootState } from "@/smartspecs/app-lib/redux/store";

export const useMeetingDetail = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    transcription: "",
  });

  const meetingId = pathname ? pathname.split("/").pop() : null;

  const { meetings, loading, error } = useSelector(
    (state: RootState) => state.meetings
  );

  const meeting = meetings.find((m) => m.id === meetingId);

  useEffect(() => {
    if (meetingId && !meeting) {
      dispatch(getMeeting(meetingId));
    }
  }, [meetingId, meeting, dispatch]);

  useEffect(() => {
    if (meeting && isEditing) {
      setFormData({
        title: meeting.title,
        description: meeting.description,
        transcription: meeting.transcription || "",
      });
    }
  }, [meeting, isEditing]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async () => {
    if (!meeting) return;
    const updatedData = {
      title: formData.title,
      description: formData.description,
      transcription: formData.transcription,
    };
    await dispatch(
      updateMeeting({ id: meeting.id, updatedData })
    );
    setIsEditing(false);
  };

  const handleConfirmDelete = async () => {
    if (!meeting) return;
    await dispatch(deleteMeeting(meeting.id));
    setShowDeleteModal(false);
    router.push("/projects");
  };

  return {
    isEditing,
    setIsEditing,
    showDeleteModal,
    setShowDeleteModal,
    formData,
    handleChange,
    handleSaveEdit,
    handleConfirmDelete,
    loading,
    error,
    meeting,
  };
}; 