export enum Status {
  IN_PROGRESS = "in_progress",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export function stringToStatus(status: string): Status | undefined {
  switch (status) {
    case "in_progress":
      return Status.IN_PROGRESS;
    case "approved":
      return Status.APPROVED;
    case "rejected":
      return Status.REJECTED;
    default:
      return undefined;
  }
}

export function colorByStatus(status: Status): string {
  switch (status) {
    case Status.IN_PROGRESS:
      return "warning";
    case Status.APPROVED:
      return "success";
    case Status.REJECTED:
      return "error";
    default:
      return "default";
  }
}
