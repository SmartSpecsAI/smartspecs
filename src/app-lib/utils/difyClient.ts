/**
 * Lanza el workflow de Dify con toda la info del proyecto y la reunión.
 * Se comunica con /api/workflow (API interna del backend Next.js).
 * 
 * Devuelve: {
 *   updatedRequirementsList: Requirement[],
 *   newRequirementsList: Requirement[],
 * }
 */
export async function callDifyWorkflow(
  projectId: string,
  meetingId: string,
  projectTitle: string,
  projectDescription: string,
  projectClient: string,
  meetingTitle: string,
  meetingDescription: string,
  meetingTranscription: string,
  requirementsList: object[]
): Promise<{
  updatedRequirementsList: object[];
  newRequirementsList: object[];
}> {
  try {
    // 🧠 Preparamos el payload
    const payload: any = {
      user: projectClient || "frontend-app",
      inputs: {
        project_id: projectId,
        project_title: projectTitle,
        project_description: projectDescription,
        project_client: projectClient,
        meeting_id: meetingId,
        meeting_title: meetingTitle,
        meeting_description: meetingDescription,
        meeting_transcription: meetingTranscription,
        requirements_list: JSON.stringify(requirementsList),
      },
    };

    // 🚀 Llamamos al endpoint local
    const res = await fetch("/api/workflow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`❌ Workflow error: ${res.status} – ${txt}`);
    }

    const data = await res.json();
    console.log("✅ Dify workflow raw result:", data);

    const outputs = data.data?.outputs || {};

    return {
      updatedRequirementsList: parseJSONSafely(outputs.updated_requirements_list),
      newRequirementsList: parseJSONSafely(outputs.new_requirements_list),
    };
  } catch (err) {
    console.error("❌ callDifyWorkflow failed:", err);
    throw err;
  }
}

/**
 * Parsea un string JSON de forma segura y devuelve un array.
 */
function parseJSONSafely(input: string | any): any[] {
  if (typeof input !== "string") return Array.isArray(input) ? input : [];
  try {
    const cleanInput = input
      .trim()
      .replace(/^```json/, "")  // 🔥 Elimina si empieza con ```json
      .replace(/```$/, "")      // 🔥 Elimina si termina con ```
      .trim();
    const parsed = JSON.parse(cleanInput);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn("⚠️ Error parsing JSON string:", input);
    return [];
  }
}