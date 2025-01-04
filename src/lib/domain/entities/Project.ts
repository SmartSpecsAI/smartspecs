export type Project = {
  id: string;
  name: string;
  description: string;
  clientName: string;
  startDate: Date;
  endDate: Date;
  status: "active" | "completed" | "on_hold";
  createdAt: Date;
  updatedAt: Date;
};
