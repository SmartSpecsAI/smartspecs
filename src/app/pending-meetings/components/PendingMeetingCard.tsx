import React, { useState } from "react";
import { Card, Tag, Button, Collapse, Typography, Popconfirm } from "antd";
import { CalendarOutlined, ClockCircleOutlined, UserOutlined, FileTextOutlined, DeleteOutlined, CheckOutlined } from "@ant-design/icons";

const { Paragraph, Text } = Typography;

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
}

const PendingMeetingCard: React.FC<PendingMeetingCardProps> = ({ meeting, onDelete, onAccept }) => {
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
  };

  const handleAccept = () => {
    onAccept(meeting.id);
  };

  const collapseItems = [
    {
      key: 'transcription',
      label: (
        <div className="flex items-center gap-2">
          <FileTextOutlined />
          <span>View Transcription</span>
        </div>
      ),
      children: (
        <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
          <Paragraph>
            <pre className="whitespace-pre-wrap text-sm font-mono">
              {meeting.transcription || "No transcription available"}
            </pre>
          </Paragraph>
        </div>
      ),
    },
  ];

  return (
    <Card className="mb-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{meeting.title}</h3>
            <p className="text-gray-600 text-sm">{meeting.description}</p>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Tag color="orange">Pending</Tag>
            <Button 
              type="primary"
              icon={<CheckOutlined />} 
              size="small"
              onClick={handleAccept}
              className="bg-green-500 hover:bg-green-600 border-green-500 hover:border-green-600"
            >
              Accept
            </Button>
            <Popconfirm
              title="Delete meeting"
              description="Are you sure you want to delete this meeting? This action cannot be undone."
              onConfirm={handleDelete}
              okText="Yes"
              cancelText="No"
              placement="topRight"
            >
              <Button 
                type="text" 
                icon={<DeleteOutlined />} 
                danger
                size="small"
                className="hover:bg-red-50"
              />
            </Popconfirm>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <CalendarOutlined />
            <span>{formatDate(meeting.createdAt)}</span>
          </div>
          
          {meeting.metadata?.duration && (
            <div className="flex items-center gap-1">
              <ClockCircleOutlined />
              <span>{formatDuration(meeting.metadata.duration)}</span>
            </div>
          )}
          
          {meeting.metadata?.participantEmails && meeting.metadata.participantEmails.length > 0 && (
            <div className="flex items-center gap-1">
              <UserOutlined />
              <span>{meeting.metadata.participantEmails.length} participants</span>
            </div>
          )}
        </div>

        {/* Participants */}
        {meeting.metadata?.participantEmails && meeting.metadata.participantEmails.length > 0 && (
          <div>
            <Text strong className="block mb-2">Participants:</Text>
            <div className="flex flex-wrap gap-1">
              {meeting.metadata.participantEmails.map((email, index) => (
                <Tag key={index} className="mb-1">{email}</Tag>
              ))}
            </div>
          </div>
        )}

        {/* Transcription */}
        <Collapse ghost items={collapseItems} />

        {/* Footer with actions and metadata */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            Created: {formatDate(meeting.createdAt)}
            {meeting.updatedAt !== meeting.createdAt && (
              <span> • Updated: {formatDate(meeting.updatedAt)}</span>
            )}
          </div>
          
          {meeting.metadata?.url && (
            <Button 
              type="link" 
              size="small"
              href={meeting.metadata.url}
              target="_blank"
            >
              View in Fireflies
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default PendingMeetingCard; 