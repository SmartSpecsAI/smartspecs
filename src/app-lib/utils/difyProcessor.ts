// src/app-lib/utils/difyWorkflow.ts

import { AppDispatch } from "@/smartspecs/app-lib/redux/store";
import { callDifyWorkflow } from "@/smartspecs/app-lib/utils/difyClient";
import {
  createRequirement,
  updateRequirement,
} from "@/smartspecs/app-lib/redux/slices/RequirementsSlice";
import { Priority, Status, Requirement } from "@/smartspecs/app-lib/interfaces/requirement";

interface DifyRequirement {
  id?: string;
  title?: string;
  description?: string;
  priority?: Priority;
  status?: Status;
  createdAt?: string;
  updatedAt?: string;
}

interface DifyWorkflowResponse {
  updatedRequirementsList: DifyRequirement[];
  newRequirementsList: DifyRequirement[];
}

/**
 * Lógica para:
 * 1) Llamar a Dify
 * 2) Parsear la respuesta
 * 3) Actualizar o crear requerimientos en Firebase
 */
interface ProcessDifyParams {
  dispatch: AppDispatch;
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
    // 1) Llamar workflow
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
    ) as DifyWorkflowResponse;

    // 2) Parsear arrays
    const updatedRequirementsList = wfResp?.updatedRequirementsList ?? [];
    const newRequirementsList = wfResp?.newRequirementsList ?? [];

    // 3) Actualizar requerimientos existentes
    if (updatedRequirementsList.length > 0) {
      for (const req of updatedRequirementsList) {
        if (!req.id) {
          console.warn("⚠️ Req sin 'id', no se puede actualizar:", req);
          continue;
        }
        await dispatch(
          updateRequirement({
            id: req.id,
            updatedData: {
              title: req.title ?? "Requerimiento sin título",
              description: req.description ?? "Requerimiento sin descripción",
              priority: req.priority ?? Priority.MEDIUM,
              status: req.status ?? Status.IN_PROGRESS,
            },
          })
        );
      }
    }

    // 4) Crear requerimientos nuevos
    if (newRequirementsList.length > 0) {
      for (const req of newRequirementsList) {
        if (!req.title || !req.description) {
          console.warn("⚠️ Req nuevo sin título/desc:", req);
          continue;
        }
        await dispatch(
          createRequirement({
            projectId,
            title: req.title,
            description: req.description,
            priority: req.priority ?? Priority.MEDIUM,
            status: req.status ?? Status.PENDING,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
        );
      }
    }

  } catch (error) {
    console.error("❌ Error en processDifyWorkflow:", error);
  }
}