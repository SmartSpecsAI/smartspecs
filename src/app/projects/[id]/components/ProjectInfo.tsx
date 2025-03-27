import React from "react";

interface ProjectInfoProps {
  title: string;
  client: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const ProjectInfo: React.FC<ProjectInfoProps> = ({
  title,
  client,
  description,
  status,
  createdAt,
  updatedAt,
}) => {
  return (
    <div className="bg-background p-6 rounded-xl shadow-md w-full">
      <h1 className="text-3xl font-extrabold mb-4">{title}</h1>
      <p className="mb-1">
        <strong>Cliente:</strong> {client}
      </p>
      <p className="mb-1">
        <strong>Descripción:</strong> {description}
      </p>
      <p className="mb-1">
        <strong>Estado:</strong> {status}
      </p>
      <p className="mb-1">
        <strong>Created At:</strong> {new Date(createdAt).toLocaleDateString()}
      </p>
      <p className="mb-1">
        <strong>Updated At:</strong> {new Date(updatedAt).toLocaleDateString()}
      </p>
    </div>
  );
};

export default ProjectInfo; 