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
}

const PendingMeetingsList: React.FC<PendingMeetingsListProps> = ({ meetings, onDelete, onAccept }) => {
  return (
    <div className="w-full max-w-6xl">
      <div className="grid gap-4">
        {meetings.map((meeting) => (
          <PendingMeetingCard 
            key={meeting.id} 
            meeting={meeting} 
            onDelete={onDelete}
            onAccept={onAccept}
          />
        ))}
      </div>
    </div>
  );
};

export default PendingMeetingsList; 