"use client";

import MeetingForm from '../../../app-lib/ components/forms/MeetingForm';
import MeetingInfo from './components/MeetingInfo';
import { useMeetingDetail } from "../../../app-lib/hooks/useMeetingDetail";
import LoadingSpinner from '@/smartspecs/app-lib/ components/common/LoadingSpinner';
import ErrorMessage from '@/smartspecs/app-lib/ components/messages/ErrorMessage';
import ConfirmModal from '@/smartspecs/app-lib/ components/modals/ConfirmModal';
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
    return <LoadingSpinner title="Cargando reunión..." />;
  }
  if (error) {
    return <ErrorMessage message={error} />;
  }
  if (!meeting) {
    return <ErrorMessage message="Reunión no encontrada" />;
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
        title="Eliminar Reunión"
        message="¿Estás seguro de que deseas eliminar esta reunión?"
      />
    </div>
  );
};

export default MeetingDetail;