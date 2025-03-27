export async function callDifyWorkflow() {
    try {
        console.log("🔥 Disparando workflow Dify (POST /api/workflow) ...");

        // Aquí puedes enviar projectId si tu workflow lo requiere
        const response = await fetch("/api/workflow", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error al ejecutar workflow: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log("✅ Respuesta de Dify workflow:", data);
    } catch (err) {
        console.error("❌ Error llamando al workflow de Dify:", err);
    }
}