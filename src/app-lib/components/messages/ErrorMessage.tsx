import React from 'react';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, className = '' }) => {
  return (
    <p className={`text-center mt-5 text-red-500 ${className}`}>
      {message}
    </p>
  );
};

export default ErrorMessage; 