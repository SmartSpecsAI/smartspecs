import { Representative } from "./Representative";

export type Project = {
  id: string;
  name?: string;
  description?: string;
  clientName?: string;
  userId?: string;
  representatives?: Representative[];
  startDate?: Date;
  endDate?: Date;
  status?: "active" | "completed" | "on_hold";
  createdAt?: Date;
  updatedAt?: Date;
};
