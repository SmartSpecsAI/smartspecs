import React from "react";
import { Alert } from "antd";

interface ErrorStateProps {
  error: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  return (
    <div className="w-full max-w-6xl">
      <Alert
        message="Error loading meetings"
        description={error}
        type="error"
        showIcon
        className="mb-4"
      />
    </div>
  );
};

export default ErrorState; 