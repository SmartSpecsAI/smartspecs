"use client";

import ConfirmModal from './components/ConfirmModal';
import MeetingForm from './components/MeetingForm';
import MeetingInfo from './components/MeetingInfo';
import LoadingMessage from './components/LoadingMessage';
import ErrorMessage from './components/ErrorMessage';
import { useMeetingDetail } from "./hooks/useMeetingDetail";

const MeetingDetail: React.FC = () => {
  const {
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
  } = useMeetingDetail();

  if (loading) {
    return <LoadingMessage />;
  }
  if (error) {
    return <ErrorMessage error={error} />;
  }
  if (!meeting) {
    return <p className="text-center mt-5">Reunión no encontrada</p>;
  }

  return (
    <div className="min-h-screen bg-background text-text p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Detalle de Reunión</h1>

      {isEditing ? (
        <MeetingForm
          formData={formData}
          handleChange={handleChange}
          handleSaveEdit={handleSaveEdit}
          setIsEditing={setIsEditing}
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
      />
    </div>
  );
};

export default MeetingDetail;