// Configuracion de ChromaDB para manejo de base de datos vectorial y busqueda de similitud

import { OpenAIEmbeddings } from "@langchain/openai";
import { ChromaClient } from "chromadb";

// Clave de API de OpenAI
const openAIApiKey = process.env.OPENAI_API_KEY;

if (!openAIApiKey) {
  throw new Error("❌ Falta la variable de entorno OPENAI_API_KEY");
}

// Inicializacion del cliente ChromaDB
export const chroma = new ChromaClient({
  path: "http://localhost:8000",
});

// Configuracion de embeddings con OpenAI
export const embeddings = new OpenAIEmbeddings({
  openAIApiKey: openAIApiKey,
});

// Inicializa o recupera la coleccion en ChromaDB
export const initChromaCollection = async () => {
  try {
    const collection = await chroma.getOrCreateCollection({
      name: "meetings",
      metadata: { "hnsw:space": "cosine" },
    });

    console.log("✅ Colección 'meetings' inicializada en ChromaDB.");
    return collection;
  } catch (error) {
    console.error("❌ Error al inicializar colección en ChromaDB:", error);
    throw error;
  }
};

// Guarda una transcripcion en ChromaDB con sus embeddings
export const saveMeetingToChroma = async (meetingId: string, transcription: string) => {
    try {
      console.log("🔍 Intentando guardar en ChromaDB:", { meetingId, transcription });
  
      const embedding = await embeddings.embedQuery(transcription);
      const collection = await initChromaCollection();
      
      if (!collection) {
        throw new Error("⚠️ No se pudo inicializar la colección en ChromaDB.");
      }
  
      console.log("✅ Embedding generado:", embedding);
  
      await collection.add({
        ids: [meetingId],
        embeddings: [embedding],
        documents: [transcription],
      });
  
      console.log(`✅ Meeting ${meetingId} guardado en ChromaDB.`);
    } catch (error) {
      console.error("❌ Error guardando meeting en ChromaDB:", error);
    }
  };
  
// Busca reuniones similares usando embeddings
export const getSimilarMeetings = async (transcript: string, numResults: number = 3) => {
  try {
    const vector = await embeddings.embedQuery(transcript);
    const collection = await initChromaCollection();
    
    if (!collection) {
      throw new Error("⚠️ No se pudo inicializar la colección en ChromaDB.");
    }

    const results = await collection.query({
      queryEmbeddings: vector,
      nResults: numResults,
    });

    return results.documents?.flat() || [];
  } catch (error) {
    console.error("❌ Error buscando reuniones similares en ChromaDB:", error);
    return [];
  }
};