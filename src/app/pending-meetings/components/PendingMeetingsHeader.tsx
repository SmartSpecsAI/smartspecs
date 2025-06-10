import React from "react";

// Custom reload icon
const ReloadIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

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
        <button 
          onClick={onRefresh}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition-colors"
        >
          <ReloadIcon />
          Refresh
        </button>
      </div>
    </div>
  );
};

export default PendingMeetingsHeader; 