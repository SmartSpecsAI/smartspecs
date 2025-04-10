import React from 'react';
import { Requirement } from '@/smartspecs/app-lib/redux/slices/RequirementsSlice';

interface RequirementRowProps {
  requirement: Requirement;
  index: number;
  isEditing: boolean;
  tempTitle: string;
  tempDescription: string;
  tempPriority: "low" | "medium" | "high";
  tempStatus: "pending" | "in_progress" | "completed";
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onPriorityChange: (value: "low" | "medium" | "high") => void;
  onStatusChange: (value: "pending" | "in_progress" | "completed") => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
}

const RequirementRow: React.FC<RequirementRowProps> = ({
  requirement,
  index,
  isEditing,
  tempTitle,
  tempDescription,
  tempPriority,
  tempStatus,
  onTitleChange,
  onDescriptionChange,
  onPriorityChange,
  onStatusChange,
  onEditClick,
  onDeleteClick,
}) => {
  return (
    <tr className="hover:bg-gray-50 transition-colors duration-150">
      <td className="px-1 py-2 w-6 text-center text-gray-500">
        {index + 1}
      </td>
      <td className="px-2 py-2">
        {isEditing ? (
          <input
            className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            value={tempTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Título del requerimiento"
          />
        ) : (
          <div className="text-sm font-medium text-gray-900 flex items-center">
            {requirement.title}
          </div>
        )}
      </td>

      <td className="px-2 py-2">
        {isEditing ? (
          <textarea
            className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            rows={2}
            value={tempDescription}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Descripción del requerimiento"
          />
        ) : (
          <div className="text-sm text-gray-600 line-clamp-2">{requirement.description}</div>
        )}
      </td>

      <td className="px-2 py-2">
        {isEditing ? (
          <select
            className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            value={tempPriority}
            onChange={(e) => onPriorityChange(e.target.value as "low" | "medium" | "high")}
          >
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
          </select>
        ) : (
          <div className="text-sm">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              requirement.priority === 'high' ? 'bg-red-100 text-red-800' :
              requirement.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {requirement.priority === 'high' ? 'Alta' : 
               requirement.priority === 'medium' ? 'Media' : 'Baja'}
            </span>
          </div>
        )}
      </td>

      <td className="px-2 py-2">
        {isEditing ? (
          <select
            className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            value={tempStatus}
            onChange={(e) => onStatusChange(e.target.value as "pending" | "in_progress" | "completed")}
          >
            <option value="pending">Pendiente</option>
            <option value="in_progress">En Progreso</option>
            <option value="completed">Completado</option>
          </select>
        ) : (
          <div className="text-sm">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              requirement.status === 'completed' ? 'bg-green-100 text-green-800' :
              requirement.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {requirement.status === 'completed' ? 'Completado' : 
               requirement.status === 'in_progress' ? 'En Progreso' : 'Pendiente'}
            </span>
          </div>
        )}
      </td>

      <td className="px-2 py-2">
        <div className="flex items-center space-x-1">
          <button
            className={`px-2 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
              isEditing 
                ? 'bg-green-500 hover:bg-green-600 text-white shadow-sm' 
                : 'bg-blue-500 hover:bg-blue-600 text-white shadow-sm'
            }`}
            onClick={onEditClick}
          >
            {isEditing ? "💾" : "✏️"}
          </button>
          <button
            className="px-2 py-1 bg-red-400 hover:bg-red-500 text-white rounded-md text-sm font-medium transition-all duration-200 shadow-sm"
            onClick={onDeleteClick}
          >
            🗑️
          </button>
        </div>
      </td>
    </tr>
  );
};

export default RequirementRow; 