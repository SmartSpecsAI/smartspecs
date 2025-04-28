import { callDifyWorkflow } from "./difyClient";
import { updateRequirement, createRequirement } from "@/smartspecs/app-lib/redux/slices/RequirementsSlice";
import { AppDispatch } from "@/smartspecs/app-lib/redux/store";
import { Requirement } from "@/smartspecs/app-lib/interfaces/requirement";

interface ProcessDifyParams {
  dispatch: AppDispatch;
  getState: any;
  projectId: string;
  meetingId: string;
  projectTitle: string;
  projectDescription: string;
  projectClient: string;
  meetingTitle: string;
  meetingDescription: string;
  meetingTranscription: string;
  requirementsList: Requirement[];
}

export async function processDifyWorkflow({
  dispatch,
  projectId,
  meetingId,
  projectTitle,
  projectDescription,
  projectClient,
  meetingTitle,
  meetingDescription,
  meetingTranscription,
  requirementsList,
}: ProcessDifyParams) {
  try {
    const wfResp = await callDifyWorkflow(
      projectId,
      meetingId,
      projectTitle,
      projectDescription,
      projectClient,
      meetingTitle,
      meetingDescription,
      meetingTranscription,
      requirementsList
    );

    const updatedRequirementsList = wfResp?.updatedRequirementsList ?? [];
    const newRequirementsList = wfResp?.newRequirementsList ?? [];

    // 1. Actualizar requerimientos existentes
    for (const updated of updatedRequirementsList) {
      if (!updated.id) {
        console.warn("⚠️ Requerimiento actualizado sin ID:", updated);
        continue;
      }

      await dispatch(
        updateRequirement({
          id: updated.id,
          updatedData: {
            title: updated.title,
            description: updated.description,
            priority: updated.priority,
            status: updated.status,
            responsible: (updated as any).responsible || "",
            origin: (updated as any).origin || "Dify",
            reason: (updated as any).reason || "",
            updatedAt: new Date().toISOString(),
          },
        })
      );
    }

    // 2. Crear nuevos requerimientos
    for (const req of newRequirementsList) {
      if (!req.title || !req.description) {
        console.warn("⚠️ Requerimiento nuevo incompleto:", req);
        continue;
      }

      await dispatch(
        createRequirement({
          projectId,
          title: req.title,
          description: req.description,
          priority: req.priority ?? "medium",
          status: req.status ?? "pending",
          responsible: (req as any).responsible || "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      );
    }
  } catch (err) {
    console.error("❌ Error en processDifyWorkflow:", err);
  }
}