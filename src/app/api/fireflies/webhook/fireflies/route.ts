// app/api/webhook/fireflies/route.ts
import { NextResponse } from "next/server";
import axios from "axios";
import crypto from "crypto";
import { firestore } from "@/smartspecs/lib/config/firebase-settings";
import { collection, addDoc } from "firebase/firestore";

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

    // 2. Procesar la transcripción completa
    let fullTranscript = "";
    if (transcript.sentences && transcript.sentences.length > 0) {
      fullTranscript = transcript.sentences
        .map(sentence => `[${sentence.speaker_name}]: ${sentence.text}`)
        .join("\n");
    }
    
    // 3. Generar descripción
    const description = generateDescription(transcript, participantEmails);
    
    // 4. Guardar en Firebase - colección pending-meetings
    const meetingData = {
      title: title,
      description: description,
      transcription: fullTranscript,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: {
        transcriptId: transcript.id,
        meetingId: event.meetingId,
        date: transcript.date,
        duration: duration,
        participantEmails: participantEmails,
        host: transcript.host_email,
        organizer: transcript.organizer_email,
        url: transcript.transcript_url,
        eventType: event.eventType,
        clientReferenceId: event.clientReferenceId || null
      }
    };

    // Guardar en la colección pending-meetings
    const pendingMeetingsCollection = collection(firestore, "pending-meetings");
    const docRef = await addDoc(pendingMeetingsCollection, meetingData);

    return {
      success: true,
      transcriptId: transcript.id,
      documentId: docRef.id,
      title: title,
      description: description,
      duration: duration,
      participants: participantEmails,
      host: transcript.host_email,
    };
    
  } catch (error: any) {
    console.error("❌ Error processing transcription:", error.message);
    throw error;
  }
}

// Función para generar descripción/resumen
function generateDescription(transcript: FirefliesTranscript, participantEmails: string[]): string {
  const date = new Date(transcript.date).toLocaleDateString();
  const duration = transcript.duration;
  const participantsText = participantEmails.length > 0 ? participantEmails.join(", ") : "Participants not specified";
  
  // Descripción básica
  let description = `Meeting held on ${date} with a duration of ${duration} minutes. Participants: ${participantsText}.`;

  
  return description;
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
