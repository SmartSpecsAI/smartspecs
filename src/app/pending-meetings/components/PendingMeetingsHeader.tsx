import React from "react";
import { Button } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

interface PendingMeetingsHeaderProps {
  onRefresh: () => void;
}

const PendingMeetingsHeader: React.FC<PendingMeetingsHeaderProps> = ({ onRefresh }) => {
  return (
    <div className="w-full max-w-6xl">
      <div className="flex justify-between items-center mb-6 p-6 bg-white rounded-lg shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pending Meetings</h1>
          <p className="text-gray-600">Meetings processed from Fireflies</p>
        </div>
        <Button 
          type="primary"
          icon={<ReloadOutlined />}
          onClick={onRefresh}
          className="flex items-center gap-2"
        >
          Refresh
        </Button>
      </div>
    </div>
  );
};

export default PendingMeetingsHeader; 