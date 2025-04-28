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
  getDoc,
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
  reason?: string;
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

    // 1. Actualizar requerimientos existentes
    for (const item of updatedRequirementsList) {
      const updated = item.updated;
      const history = item.history;

      if (!updated?.id) {
        console.warn("⚠️ Requerimiento actualizado sin ID válido:", updated);
        continue;
      }

      const docRef = doc(firestore, "requirements", updated.id);
      const snap = await getDoc(docRef);
      if (!snap.exists()) {
        console.warn(`🚫 ID recibido de Dify no existe en Firestore: ${updated.id}`);
        continue;
      }

      // A. Actualizar en Firestore usando dispatch
      await dispatch(
        updateRequirement({
          id: updated.id,
          updatedData: {
            title: updated.title,
            description: updated.description,
            priority: updated.priority,
            status: updated.status,
            responsible: updated.responsible ?? "",
            reason: updated.reason ?? "",
            origin: updated.origin ?? "Dify",
          },
        })
      );

      // B. Guardar historial
      const historyRef = doc(collection(firestore, "requirements", updated.id, "history"));
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

      const { id: _ignore, ...cleanedReq } = req;

      await dispatch(
        createRequirement({
          projectId,
          title: cleanedReq.title,
          description: cleanedReq.description,
          priority: cleanedReq.priority ?? Priority.MEDIUM,
          status: cleanedReq.status ?? Status.PENDING,
          responsible: cleanedReq.responsible ?? "",
          reason: cleanedReq.reason ?? "",
          origin: cleanedReq.origin ?? "Dify",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      );
    }
  } catch (err) {
    console.error("❌ Error en processDifyWorkflow:", err);
  }
}