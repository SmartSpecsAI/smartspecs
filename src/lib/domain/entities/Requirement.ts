import { Timestamp } from "firebase/firestore";

export type Requirement = {
  id: string;
  title: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  status: "in_progress" | "approved" | "rejected";
  clientRepName: string;
};
