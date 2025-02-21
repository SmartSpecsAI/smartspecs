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
                        speaker_id
                        text
                        raw_text
                        start_time
                        end_time
                        ai_filters {
                            task
                            pricing
                            metric
                            question
                            date_and_time
                            text_cleanup
                            sentiment
                        }
                    }
                    title
                    host_email
                    organizer_email
                    calendar_id
                    user {
                        user_id
                        email
                        name
                        num_transcripts
                        recent_meeting
                        minutes_consumed
                        is_admin
                        integrations
                    }
                    fireflies_users
                    participants
                    date
                    transcript_url
                    audio_url
                    video_url
                    duration
                    meeting_attendees {
                        displayName
                        email
                        phoneNumber
                        name
                        location
                    }
                    summary {
                        keywords
                        action_items
                        outline
                        shorthand_bullet
                        overview
                        bullet_gist
                        gist
                        short_summary
                        short_overview
                        meeting_type
                        topics_discussed
                        transcript_chapters
                    }
                    cal_id
                    calendar_type
                    apps_preview {
                        outputs {
                            transcript_id
                            user_id
                            app_id
                            created_at
                            title
                            prompt
                            response
                        }
                    }
                    meeting_link
                }
            }
        `,
        variables: { transcriptId: '01JMJY50S1WJDDEP5SDW37YPEA' }
    };

    const response = await axios.post(url, data, { headers });

    console.log("✅ Respuesta de Fireflies:", response.data);
    return NextResponse.json(response.data, { status: 200 });

  } catch (error: any) {
    console.error("❌ Error al hacer la solicitud:", error.response?.data || error.message);
    return NextResponse.json({ error: "Error al hacer la solicitud", details: error.message }, { status: 500 });
  }
}