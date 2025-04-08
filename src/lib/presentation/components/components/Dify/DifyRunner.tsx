"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AppDispatch,
  RootState,
} from "@/smartspecs/lib/presentation/redux/store";
import { fetchAllRequirements } from "@/smartspecs/lib/presentation/redux/slices/RequirementsSlice";
import { callDifyWorkflow } from "@/smartspecs/lib/utils/dify";
import { Meeting } from "@/smartspecs/lib/presentation/redux/slices/MeetingsSlice";
import { Requirement } from "@/smartspecs/lib/presentation/redux/slices/RequirementsSlice";
import { Project } from "@/smartspecs/lib/presentation/redux/slices/ProjectsSlice";

/** Props: pasamos el proyecto y la reunión a procesar */
interface ExecuteWorkflowButtonProps {
  projectId: string;
  meetingId: string;
}

const ExecuteWorkflowButton: React.FC<ExecuteWorkflowButtonProps> = ({
  projectId,
  meetingId,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);

  /* ───────── Datos desde Redux ───────── */
  const project = useSelector<RootState, Project | undefined>((state) =>
    state.projects.projects.find((p) => p.id === projectId)
  );

  const meeting = useSelector<RootState, Meeting | undefined>((state) =>
    state.meetings.meetings.find((m) => m.meetingId === meetingId)
  );

  const requirements = useSelector<RootState, Requirement[]>((state) =>
    state.requirements.requirements.filter((r) => r.projectId === projectId)
  );

  /* ───────── Ejecutar workflow ───────── */
  const executeWorkflow = async () => {
    if (!project || !meeting) {
      alert("Proyecto o reunión no encontrados en el store");
      return;
    }

    setLoading(true);
    try {
      await callDifyWorkflow(
        project.id,
        meeting.meetingId,
        project.title,
        project.description,
        project.client,
        meeting.meetingTitle,
        meeting.meetingDescription,
        meeting.meetingTranscription,
        requirements
      );

      // refrescamos requerimientos tras el workflow
      dispatch(fetchAllRequirements());
    } catch (err) {
      console.error("❌ Error ejecutando workflow:", err);
      alert("Error ejecutando el workflow. Revisa la consola para más detalles.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={executeWorkflow}
      disabled={loading}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
    >
      {loading ? "Ejecutando..." : "Ejecutar Flujo"}
    </button>
  );
};

export default ExecuteWorkflowButton;