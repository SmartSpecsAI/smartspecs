import React from 'react';
import { Requirement } from '@/smartspecs/app-lib/redux/slices/RequirementsSlice';

interface RequirementRowProps {
  requirement: Requirement;
  index: number;
  isEditing: boolean;
  tempTitle: string;
  tempDescription: string;
  tempPriority: "low" | "medium" | "high";
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onPriorityChange: (value: "low" | "medium" | "high") => void;
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
  onTitleChange,
  onDescriptionChange,
  onPriorityChange,
  onEditClick,
  onDeleteClick,
}) => {
  return (
    <tr className="hover:bg-gray-50 transition-colors duration-150">
      <td className="px-6 py-4 whitespace-nowrap">
        {isEditing ? (
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={tempTitle}
            onChange={(e) => onTitleChange(e.target.value)}
          />
        ) : (
          <div className="text-sm font-medium text-gray-900">
            {index + 1}. {requirement.title}
          </div>
        )}
      </td>

      <td className="px-6 py-4">
        {isEditing ? (
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={2}
            value={tempDescription}
            onChange={(e) => onDescriptionChange(e.target.value)}
          />
        ) : (
          <div className="text-sm text-gray-600">{requirement.description}</div>
        )}
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        {isEditing ? (
          <select
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={tempPriority}
            onChange={(e) => onPriorityChange(e.target.value as "low" | "medium" | "high")}
          >
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
          </select>
        ) : (
          <div className="text-sm">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              requirement.priority === 'high' ? 'bg-red-100 text-red-800' :
              requirement.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {requirement.priority}
            </span>
          </div>
        )}
      </td>

      <td className="px-6 py-4 whitespace-nowrap space-x-2">
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
            isEditing 
              ? 'bg-green-500 hover:bg-green-600 text-white' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
          onClick={onEditClick}
        >
          {isEditing ? "Guardar" : "Editar"}
        </button>
        <button
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm font-medium transition-colors duration-150"
          onClick={onDeleteClick}
        >
          Eliminar
        </button>
      </td>
    </tr>
  );
};

export default RequirementRow; 