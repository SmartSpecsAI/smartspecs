import React from 'react';

interface ErrorStateProps {
  error: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  return (
    <div className="w-full max-w-6xl p-4 mb-4 bg-red-50 border border-red-200 rounded-lg">
      <p className="text-red-600 font-medium text-center">{error}</p>
    </div>
  );
};

export default ErrorState; 