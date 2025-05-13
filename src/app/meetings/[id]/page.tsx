"use client";

import React from "react";
import MeetingInfo from "./components/MeetingInfo";
import { useMeetingDetail } from "../../../app-lib/hooks/meetings/useMeetingDetail";
import LoadingSpinner from "@/smartspecs/app-lib/components/common/LoadingSpinner";
import ErrorMessage from "@/smartspecs/app-lib/components/messages/ErrorMessage";
import ConfirmModal from "@/smartspecs/app-lib/components/modals/ConfirmModal";
import MeetingForm from "@/smartspecs/app-lib/components/forms/MeetingForm";
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
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
      <div className="w-full mb-4">
        <button
          onClick={() => router.back()}
          className="bg-background hover:bg-gray-100 text-text p-2 rounded-lg border border-border"
          aria-label="Go back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
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