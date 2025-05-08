"use client";

import React from "react";
import MeetingInfo from "./components/MeetingInfo";
import { useMeetingDetail } from "../../../app-lib/hooks/meetings/useMeetingDetail";
import LoadingSpinner from "@/smartspecs/app-lib/components/common/LoadingSpinner";
import ErrorMessage from "@/smartspecs/app-lib/components/messages/ErrorMessage";
import ConfirmModal from "@/smartspecs/app-lib/components/modals/ConfirmModal";
import MeetingForm from "@/smartspecs/app-lib/components/forms/MeetingForm";

const MeetingDetail: React.FC = () => {
  const {
    meeting,
    loading,
    error,
    isEditing,
    setIsEditing,
    showDeleteModal,
    setShowDeleteModal,
    handleConfirmDelete,
  } = useMeetingDetail();

  if (loading) {
    return <LoadingSpinner title="Loading meeting..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!meeting) {
    return <ErrorMessage message="Meeting not found" />;
  }

  return (
    <div className="min-h-screen bg-background text-text p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Meeting Details</h1>

      {isEditing ? (
        <MeetingForm
          meeting={meeting}
          onCancel={() => setIsEditing(false)}
          onSaveSuccess={() => setIsEditing(false)}
        />
      ) : (
        <MeetingInfo
          meeting={meeting}
          setIsEditing={setIsEditing}
          setShowDeleteModal={setShowDeleteModal}
        />
      )}

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Meeting"
        message="Are you sure you want to delete this meeting?"
      />
    </div>
  );
};

export default MeetingDetail;