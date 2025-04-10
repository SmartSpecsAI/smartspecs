export enum Status {
    IN_PROGRESS = "in progress",
    DONE = "done",
    PENDING = "pending",
}

export enum Priority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
}

export interface Requirement {
    id: string;
    title: string;
    description: string;
    priority: Priority;
    status: Status;
    createdAt: string;
    updatedAt: string;
    projectId: string;
}