import React from "react";

// Custom error icon
const ErrorIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

interface ErrorStateProps {
  error: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  return (
    <div className="w-full max-w-6xl">
      <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
        <div className="text-red-500 mt-0.5">
          <ErrorIcon />
        </div>
        <div>
          <h3 className="text-red-800 font-medium">Error loading meetings</h3>
          <p className="text-red-700 text-sm mt-1">{error}</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorState; 