"use client";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/smartspecs/lib/presentation/redux/store";
import { updateProjectContext } from "@/smartspecs/lib/presentation/redux/slices/ProjectsSlice";
import { Project } from "@/smartspecs/lib/presentation/redux/slices/ProjectsSlice";

interface ProjectInfoProps {
  project?: Project;
}

const ProjectInfo: React.FC<ProjectInfoProps> = ({ project }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [loadingContext, setLoadingContext] = useState(false);
  const [resettingDB, setResettingDB] = useState(false);

  const handleFeedContext = async () => {
    if (!project) return;
    try {
      setLoadingContext(true);
      await dispatch(updateProjectContext(project)).unwrap();
      alert("✅ Contexto del proyecto actualizado en ChromaDB");
    } catch (error) {
      console.error("❌ Error alimentando contexto:", error);
      alert("❌ Error al alimentar el contexto del proyecto.");
    } finally {
      setLoadingContext(false);
    }
  };

  const handleResetDB = async () => {
    try {
      setResettingDB(true);
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_LOCAL_BASE_URL}/context/clear`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json", // buena práctica, aunque no haya body
        },
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data?.detail || "Falló el reset");
      }
  
      alert("🗑️ Base de datos vectorial reiniciada correctamente");
    } catch (error) {
      console.error("❌ Error reseteando la DB:", error);
      alert("❌ Error al reiniciar la base de datos");
    } finally {
      setResettingDB(false);
    }
  };

  if (!project) {
    return <p className="text-center text-gray-500">Cargando información del proyecto...</p>;
  }

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-4">{project.title}</h2>
      <p><strong>Cliente:</strong> {project.client}</p>
      <p className="mt-2"><strong>Descripción:</strong> {project.description}</p>
      <p className="mt-2"><strong>Estado:</strong> {project.status}</p>
      <p className="mt-2 text-sm text-gray-500">Created At: {project.createdAt}</p>
      <p className="text-sm text-gray-500">Updated At: {project.updatedAt}</p>

      <div className="flex gap-4 mt-6">

        <button
          onClick={handleFeedContext}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 flex items-center gap-2"
        >
          {loadingContext ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8z" />
              </svg>
              Alimentando...
            </>
          ) : (
            "Alimentar Contexto"
          )}
        </button>

        <button
          onClick={handleResetDB}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center gap-2"
        >
          {resettingDB ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8z" />
              </svg>
              Reiniciando...
            </>
          ) : (
            "Reset Context"
          )}
        </button>
      </div>
    </div>
  );
};

export default ProjectInfo;