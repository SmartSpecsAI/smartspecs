// import { initChromaCollection } from "@/smartspecs/lib/config/chromadb";

// (async () => {
//   try {
//     console.log("🔄 Intentando inicializar la colección en ChromaDB...");

//     // Llamamos a la función para inicializar la colección
//     const collection = await initChromaCollection();

//     if (!collection) {
//       throw new Error("❌ No se pudo inicializar la colección en ChromaDB.");
//     }

//     console.log("✅ Colección 'meetings' inicializada correctamente en ChromaDB.");
//   } catch (error) {
//     console.error("❌ Error al inicializar la colección en ChromaDB:", error);
//   }
// })();

import { storeMeetingInChroma } from "@/smartspecs/lib/utils/chromadb";

(async () => {
  try {
    console.log("🔍 Intentando guardar en ChromaDB...");
    await storeMeetingInChroma("test-meeting-id", "Esta es una prueba de transcripción.");
    console.log("✅ Reunión guardada correctamente en ChromaDB.");
  } catch (error) {
    console.error("❌ Error guardando en ChromaDB:", error);
  }
})();