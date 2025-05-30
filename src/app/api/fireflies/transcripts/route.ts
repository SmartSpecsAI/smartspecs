import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const transcriptId = searchParams.get("id");

  if (!transcriptId) {
    return NextResponse.json({ error: "ID de transcripción no proporcionado" }, { status: 400 });
  }

  try {
    console.log("📢 Enviando solicitud a Fireflies API...");

    const FIREFLIES_API_KEY = process.env.FIREFLIES_API_KEY;
    if (!FIREFLIES_API_KEY) {
      console.error("🚨 Error: API Key no configurada");
      return NextResponse.json({ error: "API Key no configurada" }, { status: 500 });
    }

    const url = "https://api.fireflies.ai/graphql";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${FIREFLIES_API_KEY}`,
    };
    const data = {
        query: `
            query Transcript($transcriptId: String!) {
                transcript(id: $transcriptId) {
                    id
                    dateString
                    privacy
                    speakers {
                        id
                        name
                    }
                    sentences {
                        index
                        speaker_name
                        text
                        raw_text
                        start_time
                        end_time
                    }
                    title
                    host_email
                    organizer_email
                    participants
                    date
                    transcript_url
                    duration
                    meeting_attendees {
                        displayName
                        email
                        phoneNumber
                        name
                        location
                    }
                    cal_id
                    calendar_type
                    meeting_link
                }
            }
        `,
        variables: { transcriptId }
    };

    const response = await axios.post(url, data, { headers });

    console.log("✅ Respuesta de Fireflies:", response.data);
    return NextResponse.json(response.data, { status: 200 });

  } catch (error: any) {
    console.error("❌ Error al hacer la solicitud:", error.response?.data || error.message);
    return NextResponse.json({ error: "Error al hacer la solicitud", details: error.message }, { status: 500 });
  }
}