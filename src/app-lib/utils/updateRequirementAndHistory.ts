import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    addDoc,
    collection,
    Timestamp,
} from "firebase/firestore";
import { firestore } from "@/smartspecs/lib/config/firebase-settings";
import { Requirement } from "@/smartspecs/app-lib/interfaces/requirement";

interface HistoryField {
    oldValue: string | null;
    newValue: string | null;
}

interface RequirementHistory {
    changedAt: Timestamp;
    changedBy: string;
    origin: string;
    reason: string;
    meetingId: string;
    requirementId: string;
    fields: Record<keyof Requirement, HistoryField>;
    previousState: Partial<Requirement> | null;
}

interface UpdateRequirementParams {
    id: string;
    updatedData: Partial<Requirement>;
    changedBy: string;
    origin: string;
    reason: string;
    meetingId: string;
}

export async function updateRequirementAndHistory({
    id,
    updatedData,
    changedBy,
    origin,
    reason,
    meetingId,
}: UpdateRequirementParams): Promise<Requirement> {
    const requirementRef = doc(firestore, "requirements", id);
    const snapshot = await getDoc(requirementRef);
    const timestamp = Timestamp.now();

    let prevData: Partial<Requirement> = {};
    const existedBefore = snapshot.exists();

    if (existedBefore) {
        prevData = snapshot.data() as Requirement;
        await updateDoc(requirementRef, {
            ...updatedData,
            updatedAt: timestamp,
        });
    } else {
        await setDoc(requirementRef, {
            ...updatedData,
            createdAt: timestamp,
            updatedAt: timestamp,
        });
    }

    const allKeys: (keyof Requirement)[] = [
        "title",
        "description",
        "priority",
        "status",
        "projectId",
        "createdAt",
        "updatedAt",
    ];

    const fields: Record<keyof Requirement, HistoryField> = {} as any;

    for (const key of allKeys) {
        const newValue = (updatedData as any)[key] ?? null;
        const oldValue = existedBefore ? (prevData as any)[key] ?? null : null;

        fields[key] = {
            oldValue: oldValue !== undefined ? String(oldValue) : null,
            newValue: newValue !== undefined ? String(newValue) : null,
        };
    }

    const previousState: Partial<Requirement> | null = existedBefore
        ? {
            title: prevData.title,
            description: prevData.description,
            priority: prevData.priority,
            status: prevData.status,
            projectId: prevData.projectId,
            createdAt: prevData.createdAt,
            updatedAt: prevData.updatedAt,
        }
        : null;

    const historyEntry: RequirementHistory = {
        changedAt: timestamp,
        changedBy,
        origin,
        reason,
        meetingId,
        requirementId: id,
        fields,
        previousState,
    };

    await addDoc(collection(requirementRef, "history"), historyEntry);

    return {
        id,
        ...prevData,
        ...updatedData,
        updatedAt: timestamp.toDate().toISOString(),
    } as Requirement;
}