// Redux Slice para gestionar reuniones (Firestore + ChromaDB)
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  collection,
  addDoc,
  Timestamp,
  updateDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import { firestore } from "@/smartspecs/lib/config/firebase-settings";
import { callFastAPI } from "@/smartspecs/lib/services/api";
import { callDifyWorkflow } from "@/smartspecs/lib/utils/dify";

// Interfaz base de una reunión
export interface Meeting {
  id: string;
  projectId: string;
  title: string;
  date: string;
  description: string;
  transcription: string;
  requirements: string[];
  createdAt?: string;
}

// Estado inicial del slice
interface MeetingState {
  meetings: Meeting[];
  loading: boolean;
  error: string | null;
}

const initialState: MeetingState = {
  meetings: [],
  loading: false,
  error: null,
};

// ✅ Crear reunión en Firestore y enviar a la API de FastAPI
export const createMeeting = createAsyncThunk(
  "meetings/createMeeting",
  async (
    {
      projectId,
      title,
      description,
      transcription,
    }: {
      projectId: string;
      title: string;
      description: string;
      transcription: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const timestamp = Timestamp.now();
      const newMeetingData = {
        projectId,
        title,
        description,
        transcription,
        requirements: [],
        date: timestamp,
        createdAt: timestamp,
      };

      // 1️⃣ Guardar en Firestore
      const docRef = await addDoc(collection(firestore, "meetings"), newMeetingData);
      const newMeetingId = docRef.id;

      // 2️⃣ Enviar a la API de FastAPI (ChromaDB)
      await callFastAPI("add-meeting", "POST", {
        project_id: projectId,
        meeting_id: newMeetingId,
        transcription,
        metadata: { title, description, date: new Date().toISOString() },
      });

      await callDifyWorkflow();

      return {
        id: newMeetingId,
        ...newMeetingData,
        date: timestamp.toDate().toISOString(),
        createdAt: timestamp.toDate().toISOString(),
      } as Meeting;
    } catch (error) {
      console.error("❌ Error creando reunión:", error);
      return rejectWithValue("Error al crear la reunión");
    }
  }
);

// ✅ Obtener reuniones por proyecto desde Firestore
export const fetchMeetingsByProjectId = createAsyncThunk(
  "meetings/fetchMeetingsByProjectId",
  async (projectId: string, { rejectWithValue }) => {
    try {
      const q = query(collection(firestore, "meetings"), where("projectId", "==", projectId));
      const querySnapshot = await getDocs(q);

      const meetings: Meeting[] = querySnapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          projectId: data.projectId,
          title: data.title,
          description: data.description || "",
          transcription: data.transcription || "",
          requirements: data.requirements || [],
          date: data.date instanceof Timestamp ? data.date.toDate().toISOString() : data.date,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
        };
      });

      return meetings;
    } catch (error) {
      console.error("❌ Error obteniendo reuniones:", error);
      return rejectWithValue("Error al obtener reuniones");
    }
  }
);

// ✅ Obtener reunión específica desde Firestore
export const fetchMeetingById = createAsyncThunk(
  "meetings/fetchMeetingById",
  async (meetingId: string, { rejectWithValue }) => {
    try {
      console.log(`🔍 Buscando reunión en Firestore: ${meetingId}`);

      const docRef = doc(firestore, "meetings", meetingId);
      const snapshot = await getDoc(docRef);

      if (!snapshot.exists()) {
        return rejectWithValue("Reunión no encontrada");
      }

      const data = snapshot.data();
      return {
        id: snapshot.id,
        projectId: data.projectId,
        title: data.title,
        description: data.description || "",
        transcription: data.transcription || "",
        requirements: data.requirements || [],
        date: data.date instanceof Timestamp ? data.date.toDate().toISOString() : data.date,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
      };
    } catch (error) {
      console.error("❌ Error obteniendo reunión:", error);
      return rejectWithValue("Error al obtener reunión");
    }
  }
);

// ✅ Actualizar reunión en Firestore y API de FastAPI
export const updateMeeting = createAsyncThunk(
  "meetings/updateMeeting",
  async (
    { meetingId, updatedData }: { meetingId: string; updatedData: Partial<Meeting> },
    { rejectWithValue }
  ) => {
    try {
      const meetingRef = doc(firestore, "meetings", meetingId);
      await updateDoc(meetingRef, updatedData);

      // Si la transcripción cambia, actualizarla en la API
      if (updatedData.transcription) {
        await callFastAPI("update-meeting", "PUT", {
          meeting_id: meetingId,
          transcription: updatedData.transcription,
          metadata: {
            title: updatedData.title || "",
            description: updatedData.description || "",
            date: new Date().toISOString(),
          },
        });
      }

      await callDifyWorkflow();

      return { id: meetingId, ...updatedData };
    } catch (error) {
      console.error("❌ Error actualizando reunión:", error);
      return rejectWithValue("Error al actualizar reunión");
    }
  }
);

// ⚠️ Eliminar reunión en Firestore y API de FastAPI
export const deleteMeeting = createAsyncThunk(
  "meetings/deleteMeeting",
  async (meetingId: string, { rejectWithValue }) => {
    try {
      const meetingRef = doc(firestore, "meetings", meetingId);
      await deleteDoc(meetingRef);

      // Eliminar en API de FastAPI
      await callFastAPI("delete-meeting", "DELETE", { meeting_id: meetingId });

      await callDifyWorkflow();

      return meetingId;
    } catch (error) {
      console.error("❌ Error eliminando reunión:", error);
      return rejectWithValue("Error al eliminar reunión");
    }
  }
);

// 📌 Configuración del slice de Redux
const meetingsSlice = createSlice({
  name: "meetings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMeetingById.fulfilled, (state, action: PayloadAction<Meeting>) => {
        state.meetings.push(action.payload);
      })
      .addCase(fetchMeetingsByProjectId.fulfilled, (state, action: PayloadAction<Meeting[]>) => {
        state.meetings = action.payload;
      });
  },
});

// Exportar el reducer y funciones
export default meetingsSlice.reducer;