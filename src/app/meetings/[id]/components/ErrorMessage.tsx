import React from "react";

const ErrorMessage: React.FC<{ error: string }> = ({ error }) => (
  <p className="text-center mt-5 text-red-500">{error}</p>
);

export default ErrorMessage; 