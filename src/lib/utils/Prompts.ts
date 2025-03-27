export const CONVERSATION_ANALYSIS_PROMPT = `Analyze the following conversation transcript and generate a JSON document with the requirements. Each requirement should include:

{
    "title": "string", // Summary name for the conversation, be detailed
    "description": "string", // Brief overview of the conversation, be detailed
    "items": [
        {
            "name": "string", // Name for the requirement, be detailed
            "summary": "string", // Brief summary, be detailed
            "action_items:" "string[]" // List of action items
            "details": "string", // Detailed explanation of the requirement, with bugs definitions if exists, with concerns, expectations, step by step to follow the process. Format it to shown properly in HTML if necessary.
            "type": "bug_fix" | "new_feature" | "update", // Requirement type
            "estimated_time": "string", // Estimated time (hours/days)
            "priority": "low" | "medium" | "high", // Priority level
        }
    ],
}

Guidelines:
- Scope each requirement to achievable goals
- Distinctly separate items based on conversation segments
- Include participant names and contributions in details
- Provide implementation steps for recommended technologies

Transcript:

[TRANSCRIPT]

Produce only the JSON output as per the schema.`;
