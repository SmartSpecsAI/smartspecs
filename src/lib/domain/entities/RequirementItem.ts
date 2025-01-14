export type RequirementItem = {
  name: string;
  short_resume: string;
  long_description: string;
  type: "bug_fix" | "new_feature" | "update";
  estimation_time: string;
  priority: "low" | "medium" | "high";
  recommended_technologies: {
    name: string;
    reason: string;
    implementation_steps: string[];
  }[];
};
