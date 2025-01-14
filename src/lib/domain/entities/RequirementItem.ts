export type RequirementItem = {
  name: string;
  short_resume: string;
  details: string;
  type: "bug_fix" | "new_feature" | "update";
  estimated_time: string;
  priority: "low" | "medium" | "high";
  recommended_technologies: {
    name: string;
    reason: string;
    implementation_steps: string[];
  }[];
};
