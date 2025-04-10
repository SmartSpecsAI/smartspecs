export interface Requirement {
    id: string;
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
    status: "pending" | "in progress" | "completed";
    createdAt: string;
    updatedAt: string;
    projectId: string;
}