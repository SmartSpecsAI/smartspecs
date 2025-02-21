import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  try {
    console.log("📢 Enviando solicitud a Fireflies API...");

    const FIRELIES_API_KEY = process.env.FIREFLIES_API_KEY;
    if (!FIRELIES_API_KEY) {
      console.error("🚨 Error: API Key no configurada");
      return NextResponse.json({ error: "API Key no configurada" }, { status: 500 });
    }

    const url = "https://api.fireflies.ai/graphql";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${FIRELIES_API_KEY}`,
    };
    const data = {
      query: `
        query User($userId: String!) {
          user(id: $userId) {
            user_id
            recent_transcript
            recent_meeting
            num_transcripts
            name
            minutes_consumed
            is_admin
            integrations
            email
          }
        }
      `,
      variables: { userId: 'p3dCZLY1c5' }
    };

    const response = await axios.post(url, data, { headers });

    console.log("✅ Respuesta de Fireflies:", response.data);
    return NextResponse.json(response.data, { status: 200 });

  } catch (error: any) {
    console.error("❌ Error al hacer la solicitud:", error.response?.data || error.message);
    return NextResponse.json({ error: "Error al hacer la solicitud", details: error.message }, { status: 500 });
  }
}