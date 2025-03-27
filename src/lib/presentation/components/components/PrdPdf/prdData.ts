export const prdData = {
  title: "Project X Requirements",
  project: "SmartSpecs",
  version: "1.0.0",
  description: "This document details the project requirements.",
  requirements: [
    { 
      title: "Implement audio transcription",
      description: "Implement audio transcription", 
      type: "Functional",
      estimatedTime: 5,
      priority: "High",
      actionItems: ["Define technical requirements", "Select technology"],
    },
    { 
      title: "Automatically generate PRD documents", 
      description: "Automatically generate PRD documents", 
      type: "Functional", 
      estimatedTime: 3, 
      priority: "High", 
      actionItems: ["Research automation tools"], 
    },
    { 
      title: "Allow requirement validation", 
      description: "Allow requirement validation", 
      type: "Functional", 
      estimatedTime: 2, 
      priority: "Medium", 
      actionItems: ["Define validation criteria"], 
    },
  ],
  notes: ["Estimates are approximate.", "It is recommended to review the backlog weekly."],
}; 