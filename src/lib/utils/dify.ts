export async function callDifyWorkflow(meeting_id: string, transcription: string) {
    try {
      const response = await fetch("api/workflow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer app-rzwqQqa5S3jhOrNrrjIt2KD2`,
        },
        body: JSON.stringify({
          inputs: {
            meeting_id,
            query_context: "¿Cuál es el objetivo del proyecto?",
            query_meetings: "¿Qué decisiones se tomaron?",
            query_requirements: "¿Qué requerimientos pidió el cliente?",
            meeting_transcription: transcription,
          },
        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al ejecutar workflow: ${response.status} - ${errorText}`);
      }
  
      const data = await response.json();
      console.log("✅ Workflow ejecutado con éxito:", data);
      return data;
    } catch (err) {
      console.error("❌ Error llamando al workflow de Dify:", err);
    }
  }