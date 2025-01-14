export const CONVERSATION_ANALYSIS_PROMPT = `I want you to analyze the following conversation transcript and generate a detailed JSON document based on its content. The JSON should contain a list of requirements, with each item including the following fields:

{
    "title: string, // Representative name for the conversation,
    "description: string, // Brief description of the conversation,
    "items": [
        {
        "name": "string", // Representative name for the requirement
        "short_resume": "string", // Brief summary
        "long_description": "string", // Detailed explanation including participant contributions
        "type": "bug_fix" | "new_feature" | "update", // Type of requirement
        "estimation_time": "string", // Estimated completion time (hours/days)
        "priority": "low" | "medium" | "high", // Priority level
        "recommended_technologies": [
            {
            "name": "string", // Technology/tool name
            "reason": "string", // Why it's suitable
            "implementation_steps": ["string"] // Step-by-step implementation guide
            }
        ]
        }
    ]
}

Guidelines for analysis:
- Each requirement should be scoped to realizable goals
- Clearly separate items based on distinct conversation parts
- Include participant names and their contributions in long_description
- Provide detailed implementation steps for each recommended technology

Here is the conversation transcript:

[TRANSCRIPT]

Please analyze the transcript carefully and produce and only the JSON output following the schema above.`;
