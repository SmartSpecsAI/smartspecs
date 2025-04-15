import { useState } from "react";
import { collection, getDocs, DocumentData } from "firebase/firestore";
import { firestore } from "@/smartspecs/lib/config/firebase-settings";

export const useRequirementHistory = () => {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [histories, setHistories] = useState<Record<string, DocumentData[]>>({});

    const toggleExpand = async (reqId: string) => {
        if (expandedId === reqId) {
            setExpandedId(null);
        } else {
            setExpandedId(reqId);

            if (!histories[reqId]) {
                const ref = collection(firestore, "requirements", reqId, "history");
                const snap = await getDocs(ref);
                const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setHistories((prev) => ({ ...prev, [reqId]: data }));
            }
        }
    };

    return {
        expandedId,
        histories,
        toggleExpand,
    };
};