"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/smartspecs/lib/presentation/redux/store";
import { fetchAllRequirements } from "@/smartspecs/lib/presentation/redux/slices/RequirementsSlice";

const useAppDispatch = () => useDispatch<AppDispatch>();

const ExecuteWorkflowButton = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const executeWorkflow = async () => {
    setLoading(true);

    try {
      console.log("🚀 Enviando solicitud a /api/workflow...");
      const res = await fetch("/api/workflow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}), // 🔥 Ahora enviamos un JSON válido
      });

      console.log("📡 Respuesta recibida:", res.status, res.statusText);
      if (!res.ok) {
        const errorText = await res.text(); // Obtener el mensaje de error
        throw new Error(`Error HTTP: ${res.status} - ${errorText}`);
      }

      const data = await res.json();
      console.log("✅ Respuesta del workflow:", data);
    } catch (error) {
      console.error("❌ Error ejecutando el workflow:", error);
    } finally {
      setLoading(false);
      // Fetch updated requirements after workflow execution
      dispatch(fetchAllRequirements());
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <button
        onClick={executeWorkflow}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {loading ? "Ejecutando..." : "Ejecutar Flujo"}
      </button>
    </div>
  );
};

export default ExecuteWorkflowButton;