import React, { useState } from "react";

const CalendarIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const FileTextIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const DeleteIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const ChevronUpIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
  </svg>
);

// Loading spinner icon
const LoadingSpinner = () => (
  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

// Custom confirmation modal component
const ConfirmModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}> = ({ isOpen, onClose, onConfirm, title, description }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

interface PendingMeeting {
  id: string;
  title: string;
  description: string;
  transcription: string;
  createdAt: string;
  updatedAt: string;
  metadata?: {
    transcriptId: string;
    meetingId: string;
    date: string;
    duration: number;
    participantEmails: string[];
    host: string;
    organizer: string;
    url: string;
    eventType: string;
    clientReferenceId?: string;
  };
}

interface PendingMeetingCardProps {
  meeting: PendingMeeting;
  onDelete: (meetingId: string) => void;
  onAccept: (meetingId: string) => void;
  isAccepting?: boolean;
  isDeleting?: boolean;
}

const PendingMeetingCard: React.FC<PendingMeetingCardProps> = ({ 
  meeting, 
  onDelete, 
  onAccept, 
  isAccepting = false,
  isDeleting = false 
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showTranscription, setShowTranscription] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const handleDelete = () => {
    onDelete(meeting.id);
    setShowConfirmModal(false);
  };

  const handleAccept = () => {
    onAccept(meeting.id);
  };

  return (
    <>
      <div className="mb-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{meeting.title}</h3>
              <p className="text-gray-600 text-sm">{meeting.description}</p>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                Pending
              </span>
              <button 
                onClick={handleAccept}
                disabled={isAccepting || isDeleting}
                className={`inline-flex items-center gap-1 px-3 py-1 text-white text-sm font-medium rounded-md transition-colors ${
                  isAccepting || isDeleting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {isAccepting ? <LoadingSpinner /> : <CheckIcon />}
                {isAccepting ? 'Processing...' : 'Accept'}
              </button>
              <button 
                onClick={() => setShowConfirmModal(true)}
                disabled={isAccepting || isDeleting}
                className={`p-1 rounded-md transition-colors ${
                  isAccepting || isDeleting
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-red-500 hover:bg-red-50'
                }`}
              >
                {isDeleting ? <LoadingSpinner /> : <DeleteIcon />}
              </button>
            </div>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <CalendarIcon />
              <span>{formatDate(meeting.createdAt)}</span>
            </div>
            
            {meeting.metadata?.duration && (
              <div className="flex items-center gap-1">
                <ClockIcon />
                <span>{formatDuration(meeting.metadata.duration)}</span>
              </div>
            )}
            
            {meeting.metadata?.participantEmails && meeting.metadata.participantEmails.length > 0 && (
              <div className="flex items-center gap-1">
                <UserIcon />
                <span>{meeting.metadata.participantEmails.length} participants</span>
              </div>
            )}
          </div>

          {/* Participants */}
          {meeting.metadata?.participantEmails && meeting.metadata.participantEmails.length > 0 && (
            <div>
              <span className="block mb-2 font-medium text-gray-900">Participants:</span>
              <div className="flex flex-wrap gap-1">
                {meeting.metadata.participantEmails.map((email, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                    {email}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Transcription */}
          <div>
            <button
              onClick={() => setShowTranscription(!showTranscription)}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <FileTextIcon />
              <span>View Transcription</span>
              {showTranscription ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </button>
            
            {showTranscription && (
              <div className="mt-3 bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm font-mono text-gray-700">
                  {meeting.transcription || "No transcription available"}
                </pre>
              </div>
            )}
          </div>

          {/* Footer with actions and metadata */}
          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <div className="text-xs text-gray-500">
              Created: {formatDate(meeting.createdAt)}
              {meeting.updatedAt !== meeting.createdAt && (
                <span> • Updated: {formatDate(meeting.updatedAt)}</span>
              )}
            </div>
            
            {meeting.metadata?.url && (
              <a 
                href={meeting.metadata.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                View in Fireflies
              </a>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleDelete}
        title="Delete meeting"
        description="Are you sure you want to delete this meeting? This action cannot be undone."
      />
    </>
  );
};

export default PendingMeetingCard; 