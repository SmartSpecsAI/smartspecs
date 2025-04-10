import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import {
  fetchMeetingById,
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

  const meeting = meetings.find((m) => m.meetingId === meetingId);

  useEffect(() => {
    if (meetingId && !meeting) {
      dispatch(fetchMeetingById(meetingId));
    }
  }, [meetingId, meeting, dispatch]);

  useEffect(() => {
    if (meeting && isEditing) {
      setFormData({
        title: meeting.meetingTitle,
        description: meeting.meetingDescription,
        transcription: meeting.meetingTranscription || "",
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
      meetingTitle: formData.title,
      meetingDescription: formData.description,
      meetingTranscription: formData.transcription,
    };
    await dispatch(
      updateMeeting({ meetingId: meeting.meetingId, updatedData })
    );
    setIsEditing(false);
  };

  const handleConfirmDelete = async () => {
    if (!meeting) return;
    await dispatch(deleteMeeting(meeting.meetingId));
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