import React from 'react';
import { Requirement, Status, Priority } from '@/smartspecs/app-lib/interfaces/requirement';

interface RequirementRowProps {
  requirement: Requirement;
  index: number;
  isEditing: boolean;
  tempTitle: string;
  tempDescription: string;
  tempPriority: Priority;
  tempStatus: Status;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onPriorityChange: (value: Priority) => void;
  onStatusChange: (value: Status) => void;
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
    <tr className="hover:bg-gray-50">
      <td className="px-1 py-2 text-center text-sm text-gray-500">{index + 1}</td>
      <td className="px-2 py-2">
        {isEditing ? (
          <input
            type="text"
            className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            value={tempTitle}
            onChange={(e) => onTitleChange(e.target.value)}
          />
        ) : (
          <div className="text-sm font-medium text-gray-900">{requirement.title}</div>
        )}
      </td>
      <td className="px-2 py-2">
        {isEditing ? (
          <textarea
            className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            value={tempDescription}
            onChange={(e) => onDescriptionChange(e.target.value)}
          />
        ) : (
          <div className="text-sm text-gray-500">{requirement.description}</div>
        )}
      </td>
      <td className="px-2 py-2">
        {isEditing ? (
          <select
            className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            value={tempPriority}
            onChange={(e) => onPriorityChange(e.target.value as Priority)}
          >
            <option value={Priority.LOW}>Baja</option>
            <option value={Priority.MEDIUM}>Media</option>
            <option value={Priority.HIGH}>Alta</option>
          </select>
        ) : (
          <div className="text-sm">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              requirement.priority === Priority.HIGH ? 'bg-red-100 text-red-800' :
              requirement.priority === Priority.MEDIUM ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {requirement.priority === Priority.HIGH ? 'Alta' : 
               requirement.priority === Priority.MEDIUM ? 'Media' : 'Baja'}
            </span>
          </div>
        )}
      </td>
      <td className="px-2 py-2">
        {isEditing ? (
          <select
            className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            value={tempStatus}
            onChange={(e) => onStatusChange(e.target.value as Status)}
          >
            <option value={Status.IN_PROGRESS}>En Progreso</option>
            <option value={Status.DONE}>Completado</option>
            <option value={Status.PENDING}>Pendiente</option>
          </select>
        ) : (
          <div className="text-sm">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              requirement.status === Status.DONE ? 'bg-green-100 text-green-800' :
              requirement.status === Status.IN_PROGRESS ? 'bg-blue-100 text-blue-800' :
              'bg-red-100 text-red-800'
            }`}>
              {requirement.status === Status.DONE ? 'Completado' : 
               requirement.status === Status.IN_PROGRESS ? 'En Progreso' : 'Pendiente'}
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