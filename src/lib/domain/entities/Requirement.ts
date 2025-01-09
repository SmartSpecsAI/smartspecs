import { Timestamp } from "firebase/firestore";
import { Transcription } from "./Transcription";

export type Requirement = {
  id: string;
  title: string;
  description: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  // status: "in_progress" | "approved" | "rejected";
  status: string;
  clientRepName: string;
  projectId: string;
  source: "audio" | "text" | "integration";
  audioUrl?: string;
  text?: string;
  integration?: {
    id: string;
    name: string;
  };
  transcription?: Transcription;
};
