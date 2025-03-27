import React from "react";
import Link from "next/link";
import { Meeting } from "@/smartspecs/lib/presentation/redux/slices/MeetingsSlice";

interface MeetingListProps {
  meetings: Meeting[];
  projectId: string;
}

const MeetingList: React.FC<MeetingListProps> = ({ meetings, projectId }) => {
  if (meetings.length === 0) {
    return <p>No hay reuniones registradas para este proyecto</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {meetings.map((meeting: Meeting) => (
        <Link key={meeting.id} href={`/meetings/${meeting.id}`}>
          <div className="border p-4 rounded shadow-sm hover:shadow-md transition cursor-pointer">
            <h3 className="font-semibold text-lg">{meeting.title}</h3>
            <p className="text-sm mb-1">
              <strong>Fecha:</strong> {new Date(meeting.date).toLocaleString()}
            </p>
            <p className="text-sm mb-1">
              <strong>Descripción:</strong> {meeting.description}
            </p>
            {meeting.transcription ? (
              <p className="text-sm text-green-800">
                <strong>Transcripción:</strong> {meeting.transcription.substring(0, 50)}...
              </p>
            ) : (
              <p className="text-sm text-gray-600">
                <em>Sin transcripción</em>
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default MeetingList; 