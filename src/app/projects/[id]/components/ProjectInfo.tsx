import LoadingSpinner from "@/smartspecs/app-lib/components/common/LoadingSpinner";
import { Project } from "@/smartspecs/app-lib/interfaces/project";

interface ProjectInfoProps {
  project?: Project;
}

const ProjectInfo: React.FC<ProjectInfoProps> = ({ project }) => {
  
  if (!project) {
    return <LoadingSpinner title="Cargando información del proyecto..." />;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800">{project.title}</h2>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-500 mb-1">Cliente</h3>
            <p className="text-lg text-gray-800">{project.client}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-500 mb-1">Descripción</h3>
            <p className="text-gray-800">{project.description}</p>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-6">
            <div>
              <span className="font-medium">Creado:</span> {new Date(project.createdAt).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium">Actualizado:</span> {new Date(project.updatedAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectInfo;