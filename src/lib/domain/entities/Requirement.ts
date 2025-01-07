import { Timestamp } from "firebase/firestore";

export type Requirement = {
  id: string;
  title: string;
  description: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  status: "in_progress" | "approved" | "rejected";
  clientRepName: string;
  source: "audio" | "text" | "integration";
  audioUrl?: string;
  text?: string;
  integration?: {
    id: string;
    name: string;
  };
};
