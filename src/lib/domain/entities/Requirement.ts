import { Timestamp } from "firebase/firestore";
import { RequirementItem } from "./RequirementItem";
import { Status } from "./Status";

export type Requirement = {
  id: string;
  title: string;
  description: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  status: Status;
  clientRepName: string;
  projectId: string;
  source: "audio" | "text" | "integration";
  audioUrl?: string;
  text?: string;
  integration?: {
    id: string;
    name: string;
  };
  transcription?: string;
  items?: RequirementItem[];
};
