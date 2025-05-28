import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "ID de usuario no proporcionado" }, { status: 400 });
  }

  try {
    console.log("📢 Enviando solicitud a Fireflies API...");

    const FIREFLIES_API_KEY = process.env.FIREFLIES_API_KEY;
    if (!FIREFLIES_API_KEY) {
      console.error("🚨 Error: API Key no configurada");
      return NextResponse.json({ error: "API Key no configurada" }, { status: 500 });
    }

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
      variables: { userId }
    };

    const response = await axios.post("https://api.fireflies.ai/graphql", data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${FIREFLIES_API_KEY}`,
      },
    });

    console.log("✅ Respuesta de Fireflies:", response.data);
    return NextResponse.json(response.data, { status: 200 });

  } catch (error: any) {
    console.error("❌ Error al hacer la solicitud:", error.response?.data || error.message);
    return NextResponse.json({ error: "Error al hacer la solicitud", details: error.message }, { status: 500 });
  }
}