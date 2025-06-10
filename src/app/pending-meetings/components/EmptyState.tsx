import React from "react";

// Custom calendar icon
const CalendarIcon = () => (
  <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <CalendarIcon />
      <h3 className="text-xl font-semibold text-gray-700 mb-2 mt-4">
        No pending meetings found
      </h3>
      <p className="text-gray-500 max-w-md">
        No pending meetings where you are the host or participant. Meetings processed from Fireflies will appear here if you were involved.
      </p>
    </div>
  );
};

export default EmptyState; 