import { NextResponse } from "next/server";
import axios from "axios";

const API_KEY = process.env.DIFY_API_KEY;
const DIFY_API_URL = "http://localhost/v1/workflows/run"; // ✅ URL correcta

export async function POST() {
    try {
        console.log("⚡ Recibida solicitud en /api/workflow");

        if (!API_KEY) {
            console.error("❌ ERROR: La API KEY no está definida en el servidor.");
            return NextResponse.json({ error: "Falta la API KEY en el backend" }, { status: 500 });
        }

        // 🔥 Directamente enviamos los valores fijos, sin checks innecesarios
        const requestBody = {
            inputs: {}, // Siempre vacío
            user: "test-user", // Usuario fijo
        };

        console.log("📤 Enviando a Dify:", requestBody);

        const response = await axios.post(DIFY_API_URL, requestBody, {
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
            },
        });

        console.log("✅ Respuesta de Dify:", response.status, response.data);
        return NextResponse.json(response.data, { status: response.status });

    } catch (error: any) {
        console.error("❌ Error al comunicarse con Dify:", error.response?.data || error.message);

        return NextResponse.json(
            { error: error.message, details: error.response?.data },
            { status: error.response?.status || 500 }
        );
    }
}