// src/app-lib/utils/difyProcessor.ts

import { AppDispatch } from "@/smartspecs/app-lib/redux/store";
import { callDifyWorkflow } from "@/smartspecs/app-lib/utils/difyClient";
import {
  createRequirement,
  updateRequirement,
} from "@/smartspecs/app-lib/redux/slices/RequirementsSlice";
import { firestore } from "@/smartspecs/lib/config/firebase-settings";
import {
  Priority,
  Requirement,
  Status,
} from "@/smartspecs/app-lib/interfaces/requirement";
import {
  doc,
  setDoc,
  collection,
  Timestamp,
} from "firebase/firestore";

interface HistoryFields {
  [field: string]: {
    oldValue: string;
    newValue: string;
  };
}

interface HistoryItem {
  requirementId: string;
  meetingId: string;
  changedBy: string;
  origin: string;
  changedAt: string;
  fields: HistoryFields;
}

interface DifyOutput {
  updated: Requirement;
  history: HistoryItem;
}

interface DifyWorkflowResponse {
  updatedRequirementsList: DifyOutput[];
  newRequirementsList: Requirement[];
}

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

    const updatedRequirementsList = wfResp?.updatedRequirementsList ?? [];
    const newRequirementsList = wfResp?.newRequirementsList ?? [];

    // 1. Actualizar requerimientos existentes y guardar historial
    for (const item of updatedRequirementsList) {
      const updated = item.updated;
      const history = item.history;

      if (!updated.id) {
        console.warn("⚠️ Requerimiento actualizado sin ID:", updated);
        continue;
      }

      // A. Actualizar el requerimiento
      await dispatch(
        updateRequirement({
          id: updated.id,
          updatedData: {
            title: updated.title,
            description: updated.description,
            priority: updated.priority,
            status: updated.status,
          },
        })
      );

      // B. Guardar historial
      const historyRef = doc(
        collection(firestore, "requirements", updated.id, "history")
      );

      await setDoc(historyRef, {
        ...history,
        changedAt: Timestamp.now(),
      });
    }

    // 2. Crear requerimientos nuevos
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
          priority: req.priority ?? Priority.MEDIUM,
          status: req.status ?? Status.PENDING,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      );
    }
  } catch (error) {
    console.error("❌ Error en processDifyWorkflow:", error);
  }
}