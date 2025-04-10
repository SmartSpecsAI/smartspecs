import { Timestamp } from "firebase/firestore";

export const getTimestampObject = () => {
    const now = Timestamp.now();
    return {
        createdAt: now,
        updatedAt: now,
    };
};

export const getUpdatedTimestamp = () => ({
    updatedAt: Timestamp.now(),
});

export const toISODate = (ts: any): string =>
    ts instanceof Timestamp ? ts.toDate().toISOString() : ts;