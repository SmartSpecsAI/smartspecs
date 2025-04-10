import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/smartspecs/app-lib/redux/store";
import { createMeeting, fetchMeetingsByProjectId } from "@/smartspecs/app-lib/redux/slices/MeetingsSlice";
import { updateRequirement, createRequirement } from "@/smartspecs/app-lib/redux/slices/RequirementsSlice";

const useAppDispatch = () => useDispatch<AppDispatch>();

interface UseMeetingFormProps {
  formData?: {
    title: string;
    description: string;
    transcription: string;
  };
  projectId?: string;
  projectTitle?: string;
  projectDescription?: string;
  projectClient?: string;
  requirementsList?: object[];
  isEditing?: boolean;
  onSaveSuccess?: () => void;
  onCancel: () => void;
  handleSaveEdit?: () => Promise<void>;
  setIsEditing?: (value: boolean) => void;
}

export const useMeetingForm = ({
  formData,
  projectId,
  projectTitle,
  projectDescription,
  projectClient,
  requirementsList,
  isEditing = false,
  onSaveSuccess,
  onCancel,
  handleSaveEdit,
  setIsEditing,
}: UseMeetingFormProps) => {
  const dispatch = useAppDispatch();
  const [meetingTitle, setMeetingTitle] = useState(formData?.title || "");
  const [meetingDescription, setMeetingDescription] = useState(formData?.description || "");
  const [meetingTranscription, setMeetingTranscription] = useState(formData?.transcription || "");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (formData) {
      setMeetingTitle(formData.title);
      setMeetingDescription(formData.description);
      setMeetingTranscription(formData.transcription);
    }
  }, [formData]);

  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (isEditing && handleSaveEdit) {
      await handleSaveEdit();
      setIsEditing?.(false);
      setIsLoading(false);
      return;
    }

    if (!projectId) return;

    const result = await dispatch(
      createMeeting({
        projectId: projectId,
        projectTitle: projectTitle || "",
        projectDescription: projectDescription || "",
        projectClient: projectClient || "",
        meetingTitle: meetingTitle,
        meetingDescription: meetingDescription,
        meetingTranscription: meetingTranscription,
        requirementsList: requirementsList || [],
      })
    );

    if (result.meta.requestStatus === 'fulfilled') {
      const { updatedRequirementsList, newRequirementsList } = result.payload as any;

      if (updatedRequirementsList && updatedRequirementsList.length > 0) {
        for (const requirement of updatedRequirementsList) {
          await dispatch(updateRequirement({
            id: requirement.id,
            updatedData: requirement
          }));
        }
      }

      if (newRequirementsList && newRequirementsList.length > 0) {
        for (const requirement of newRequirementsList) {
          await dispatch(createRequirement({
            ...requirement,
            projectId: projectId
          }));
        }
      }
    }

    await dispatch(fetchMeetingsByProjectId(projectId));
    setIsLoading(false);
    setMeetingTitle("");
    setMeetingDescription("");
    setMeetingTranscription("");
    onSaveSuccess?.();
    onCancel();
  };

  return {
    meetingTitle,
    setMeetingTitle,
    meetingDescription,
    setMeetingDescription,
    meetingTranscription,
    setMeetingTranscription,
    isLoading,
    handleCreateMeeting,
  };
}; 