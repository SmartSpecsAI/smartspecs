import { NextResponse } from "next/server";
import { initChromaCollection, embeddings } from "@/smartspecs/lib/config/chromadb";

// Endpoint API para almacenar transcripciones en ChromaDB
export async function POST(req: Request) {
  try {
    // Validar el cuerpo de la solicitud
    if (!req.body) {
      console.debug('⚠️ Solicitud recibida con cuerpo vacío');
      return NextResponse.json({ error: "Cuerpo de la solicitud vacío" }, { status: 400 });
    }

    const { meetingId, transcription } = await req.json();
    console.debug('🔍 Datos de solicitud procesados:', { meetingId, transcriptionLength: transcription?.length });

    // Validar parámetros requeridos
    if (!meetingId || !transcription) {
      console.debug('⚠️ Faltan parámetros requeridos:', { meetingId: !!meetingId, transcription: !!transcription });
      return NextResponse.json(
        { error: "meetingId y transcription son requeridos" },
        { status: 400 }
      );
    }

    console.debug('🔍 Procesando solicitud para ChromaDB:', { meetingId });

    // Inicializar colección de ChromaDB
    const collection = await initChromaCollection();
    if (!collection) {
      console.error('❌ Error al inicializar la colección de ChromaDB');
      return NextResponse.json({ error: "ChromaDB no inicializado" }, { status: 500 });
    }

    // Generar y almacenar embedding
    const embedding = await embeddings.embedQuery(transcription);
    console.debug('🔍 Embedding generado para la transcripción');

    await collection.add({
      ids: [meetingId],
      embeddings: [embedding],
      documents: [transcription],
    });

    console.debug('✅ Almacenado exitosamente en ChromaDB:', { meetingId });
    return NextResponse.json({ message: "Guardado en ChromaDB con éxito" });
  } catch (error) {
    console.error('❌ Error al almacenar en ChromaDB:', error);
    return NextResponse.json({ error: "Error al conectar con ChromaDB" }, { status: 500 });
  }
}