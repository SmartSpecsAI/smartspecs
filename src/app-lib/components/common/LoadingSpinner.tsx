import React from "react";

interface LoadingSpinnerProps {
  className?: string;
  title?: string;
  subtitle?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  className = "min-h-[50vh]", 
  title = "Cargando...",
  subtitle 
}) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className="animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded-md mb-4"></div>
        {subtitle && <div className="h-4 w-32 bg-gray-200 rounded-md mx-auto"></div>}
        <p className="text-center text-gray-500">{title}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner; 