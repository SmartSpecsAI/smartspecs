// app/api/webhook/fireflies/route.ts
import { NextResponse } from "next/server";
import axios from "axios";
import crypto from "crypto";

// Tipos para los eventos de Fireflies (según documentación oficial)
interface FirefliesWebhookEvent {
  meetingId: string;
  eventType: string;
  clientReferenceId?: string;
}

interface FirefliesTranscript {
  id: string;
  dateString: string;
  privacy: string;
  speakers: Array<{
    id: string;
    name: string;
  }>;
  sentences: Array<{
    index: number;
    speaker_name: string;
    text: string;
    raw_text: string;
    start_time: number;
    end_time: number;
  }>;
  title: string;
  host_email: string;
  organizer_email: string;
  participants: string[];
  date: string;
  transcript_url: string;
  duration: number;
  meeting_attendees: Array<{
    displayName: string;
    email: string;
    phoneNumber?: string;
    name: string;
    location?: string;
  }>;
  cal_id?: string;
  calendar_type?: string;
  meeting_link?: string;
}

// Función para verificar la firma del webhook de Fireflies
function verifyFirefliesSignature(payload: string, signature: string, secret: string): boolean {
  try {
    if (!signature || !secret) {
      return true;
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    
    const actualSignature = signature.replace('sha256=', '');
    
    const isValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(actualSignature, 'hex')
    );
    return isValid;
  } catch (error) {
    console.error("❌ Error verificando firma:", error);
    return false;
  }
}

// Función para obtener la transcripción desde Fireflies
async function getTranscriptionFromFireflies(transcriptId: string): Promise<FirefliesTranscript | null> {
  try {
    const FIREFLIES_API_KEY = process.env.FIREFLIES_API_KEY;
    if (!FIREFLIES_API_KEY) {
      throw new Error("API Key not configured");
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
    return response.data?.data?.transcript || null;

  } catch (error: any) {
    console.error("❌ Error getting transcription:", error.response?.data || error.message);
    throw error;
  }
}

// Función para procesar la transcripción
async function processTranscription(transcript: FirefliesTranscript, event: FirefliesWebhookEvent) {
  console.log("🔄 Processing transcription:", transcript.id);
  
  try {
    // 1. Extraer información básica
    const title = transcript.title || `Meeting ${new Date(transcript.date).toLocaleDateString()}`;
    const duration = transcript.duration;
    const participantEmails = transcript.meeting_attendees.map(attendee => attendee.email);
    const participantNames = transcript.meeting_attendees.map(attendee => attendee.displayName || attendee.name);
    const interviewDate = new Date(transcript.date);

    
    // 2. Procesar la transcripción completa
    let fullTranscript = "";
    if (transcript.sentences && transcript.sentences.length > 0) {
      fullTranscript = transcript.sentences
        .map(sentence => `[${sentence.speaker_name}]: ${sentence.text}`)
        .join("\n");
    }
    
    // 3. Generar descripción
    const description = generateDescription(transcript, participantNames);
    
    // 4. Preparar datos para Dify
    const difyPayload = {
      title: title,
      description: description,
      transcript: fullTranscript,
      metadata: {
        transcriptId: transcript.id,
        meetingId: event.meetingId,
        date: transcript.date,
        duration: duration,
        participants: participantNames,
        participantEmails: participantEmails,
        host: transcript.host_email,
        organizer: transcript.organizer_email,
        url: transcript.transcript_url,
        eventType: event.eventType,
        clientReferenceId: event.clientReferenceId || null
      }
    };
    
    // 5. Enviar a Dify - COMENTADO TEMPORALMENTE PARA TESTING
    /*
    const difyResult = await sendToDify(difyPayload);
    
    console.log("✅ Transcripción procesada y enviada a Dify exitosamente");
    return {
      success: true,
      transcriptId: transcript.id,
      title: title,
      difyResult: difyResult
    };
    */
    
    // RESPUESTA TEMPORAL SIN DIFY
    console.log("✅ Transcription processed successfully ... ");
    return {
      success: true,
      transcriptId: transcript.id,
      title: title,
      description: description,
      duration: `${Math.round(duration / 60)} minutos`,
      participants: participantNames,
    };
    
  } catch (error: any) {
    console.error("❌ Error processing transcription:", error.message);
    throw error;
  }
}

// Función para generar descripción/resumen
function generateDescription(transcript: FirefliesTranscript, participantNames: string[]): string {
  const date = new Date(transcript.date).toLocaleDateString();
  const duration = Math.round(transcript.duration / 60);
  const participantsText = participantNames.length > 0 ? participantNames.join(", ") : "Participants not specified";
  
  // Descripción básica
  let description = `Meeting held on ${date} with a duration of ${duration} minutes. Participants: ${participantsText}.`;
  
  // Si hay transcripción, agregar preview
  if (transcript.sentences && transcript.sentences.length > 0) {
    const firstSentences = transcript.sentences
      .slice(0, 3)
      .map(s => s.text)
      .join(" ");
    
    if (firstSentences.length > 100) {
      description += ` Conversation start: "${firstSentences.substring(0, 200)}..."`;
    } else {
      description += ` Conversation start: "${firstSentences}"`;
    }
  }
  
  return description;
}

// Función para enviar datos a Dify usando el endpoint existente
async function sendToDify(payload: any) {
  try {
    console.log("📤 Enviando datos a Dify usando endpoint interno...");
    
    const difyData = {
      inputs: {
        title: payload.title,
        description: payload.description,
        transcript: payload.transcript,
        metadata: JSON.stringify(payload.metadata)
      },
      user: payload.metadata.host || "fireflies-webhook"
      // workflow_id se usa el DEFAULT_WORKFLOW_ID del endpoint
    };
    
    // Hacer request al endpoint interno
    const baseUrl = process.env.APP_URL;
    const response = await axios.post(`${baseUrl}/api/workflow`, difyData, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    return {
      success: true,
      data: response.data,
      difyWorkflowId: response.data?.workflow_run_id || null
    };
    
  } catch (error: any) {
    console.error("❌ Error sending to Dify:", error.response?.data || error.message);
    
    return {
      success: false,
      error: error.message,
      details: error.response?.data
    };
  }
}

// Webhook GET endpoint (para verificación inicial de Fireflies)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const challenge = searchParams.get("challenge");
  
  // Fireflies podría enviar un challenge para verificar el endpoint
  if (challenge) {
    return NextResponse.json({ challenge });
  }
  
  return NextResponse.json({ 
    status: "Webhook activo",
    timestamp: new Date().toISOString()
  });
}

// Webhook POST endpoint (recibe los eventos de Fireflies)
export async function POST(request: Request) {
  try {
    console.log("🎯 Webhook received from Fireflies");
    
    const body = await request.text();
    const event: FirefliesWebhookEvent = JSON.parse(body);

    // Verificación de origen y firma
    const userAgent = request.headers.get('user-agent');
    const signature = request.headers.get('x-hub-signature');
    const secret = process.env.FIREFLIES_WEBHOOK_SECRET;
    
    // Verificar firma si está configurada (OPCIONAL - para mayor seguridad)
    if (secret && signature) {
      const isValidSignature = verifyFirefliesSignature(body, signature, secret);
      if (!isValidSignature) {
        return NextResponse.json({ 
          error: "Firma inválida" 
        }, { status: 401 });
      }
    } else if (signature && !secret) {
      console.log("💡 Configure your Fireflies webhook secret");
    } else {
      console.log("ℹ️ Webhook without signature verification");
    }
    
    // Procesar diferentes tipos de eventos según documentación de Fireflies
    switch (event.eventType) {
      case 'Transcription completed': // Formato oficial según documentación
      case 'transcript_ready': // Formato alternativo por compatibilidad
      case 'meeting_processed':
        // Usar meetingId como transcriptId (son intercambiables según la documentación)
        const transcriptId = event.meetingId;
        
        if (transcriptId) {
          console.log("🔍 Obteniendo transcripción:", transcriptId);
          const transcript = await getTranscriptionFromFireflies(transcriptId);
          
          if (transcript) {
            const result = await processTranscription(transcript, event);
            return NextResponse.json(result);
          } else {
            console.log("⚠️ No se encontró transcripción para:", transcriptId);
            return NextResponse.json({ 
              success: false, 
              message: "Transcripción no encontrada" 
            }, { status: 404 });
          }
        } else {
          console.log("⚠️ No se proporcionó meetingId");
          return NextResponse.json({ 
            success: false, 
            message: "meetingId requerido" 
          }, { status: 400 });
        }
        break;
        
      default:
        console.log("ℹ️ Tipo de evento no manejado:", event.eventType);
        return NextResponse.json({ 
          success: true, 
          message: "Evento recibido pero no procesado" 
        });
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error: any) {
    console.error("❌ Error en webhook:", error.message);
    return NextResponse.json({ 
      error: "Error interno del servidor", 
      details: error.message 
    }, { status: 500 });
  }
}
