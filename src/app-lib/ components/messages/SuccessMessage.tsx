import React from 'react';

interface SuccessMessageProps {
  message: string;
  className?: string;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ message, className = '' }) => {
  return (
    <p className={`text-green-600 font-bold ${className}`}>
      {message}
    </p>
  );
};

export default SuccessMessage; 