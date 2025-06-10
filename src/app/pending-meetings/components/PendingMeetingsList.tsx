import React from "react";
import PendingMeetingCard from "./PendingMeetingCard";

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

interface PendingMeetingsListProps {
  meetings: PendingMeeting[];
  onDelete: (meetingId: string) => void;
  onAccept: (meetingId: string) => void;
  acceptingMeetingId: string | null;
  deletingMeetingId: string | null;
}

const PendingMeetingsList: React.FC<PendingMeetingsListProps> = ({ 
  meetings, 
  onDelete, 
  onAccept, 
  acceptingMeetingId,
  deletingMeetingId 
}) => {
  return (
    <div className="w-full max-w-6xl">
      <div className="grid gap-4">
        {meetings.map((meeting) => (
          <PendingMeetingCard 
            key={meeting.id} 
            meeting={meeting} 
            onDelete={onDelete}
            onAccept={onAccept}
            isAccepting={acceptingMeetingId === meeting.id}
            isDeleting={deletingMeetingId === meeting.id}
          />
        ))}
      </div>
    </div>
  );
};

export default PendingMeetingsList; 