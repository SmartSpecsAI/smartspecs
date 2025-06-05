import React from "react";
import { CalendarOutlined } from "@ant-design/icons";

const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <CalendarOutlined className="text-6xl text-gray-300 mb-4" />
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        No pending meetings found
      </h3>
      <p className="text-gray-500 max-w-md">
        No pending meetings where you are the host or participant. Meetings processed from Fireflies will appear here if you were involved.
      </p>
    </div>
  );
};

export default EmptyState; 