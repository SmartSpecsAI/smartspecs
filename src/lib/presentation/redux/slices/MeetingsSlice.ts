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
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { firestore } from "@/smartspecs/lib/config/firebase-settings";
import { updateDoc as updateProjectDoc } from "firebase/firestore";

export interface Meeting {
  id: string;
  projectId: string;
  title: string;
  date: string;
  description: string;
  audioId: string;
  transcription: string;
  requirements: string[];
  createdAt?: string;
}

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

// THUNK: crear una reunión (ya lo tienes, lo muestro por contexto)
export const createMeeting = createAsyncThunk(
  "meetings/createMeeting",
  async (
    {
      projectId,
      title,
      description,
      audioFile,
    }: {
      projectId: string;
      title: string;
      description: string;
      audioFile?: File | null;
    },
    { rejectWithValue }
  ) => {
    try {
      let audioId = "";
      if (audioFile) {
        const storage = getStorage();
        const audioRef = ref(
          storage,
          `recordings/${Date.now()}_${audioFile.name}`
        );
        await uploadBytes(audioRef, audioFile);
        audioId = audioRef.name;
      }

      const newMeetingData = {
        projectId,
        title,
        description,
        audioId,
        transcription: "",
        requirements: [],
        date: Timestamp.now(),
        createdAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(firestore, "meetings"), newMeetingData);
      const newMeetingId = docRef.id;

      // Actualiza el proyecto -> añade el ID de la reunión a su array
      const projectRef = doc(firestore, "projects", projectId);
      await updateProjectDoc(projectRef, {
        meetings: [newMeetingId],
      });

      // Convertir Timestamps a string
      return {
        id: newMeetingId,
        projectId,
        title,
        description,
        audioId,
        transcription: "",
        requirements: [],
        date: newMeetingData.date.toDate().toISOString(),
        createdAt: newMeetingData.createdAt.toDate().toISOString(),
      } as Meeting;
    } catch (error) {
      console.error("Error creating meeting:", error);
      return rejectWithValue("Error al crear la reunión");
    }
  }
);

// THUNK: obtener todas las reuniones de un proyecto
export const fetchMeetingsByProjectId = createAsyncThunk(
  "meetings/fetchMeetingsByProjectId",
  async (projectId: string, { rejectWithValue }) => {
    try {
      const q = query(
        collection(firestore, "meetings"),
        where("projectId", "==", projectId)
      );
      const querySnapshot = await getDocs(q);

      const meetings: Meeting[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();

        const dateString =
          data.date instanceof Timestamp
            ? data.date.toDate().toISOString()
            : data.date || "";
        const createdAtString =
          data.createdAt instanceof Timestamp
            ? data.createdAt.toDate().toISOString()
            : data.createdAt || "";

        meetings.push({
          id: docSnap.id,
          projectId: data.projectId,
          title: data.title,
          description: data.description || "",
          audioId: data.audioId || "",
          transcription: data.transcription || "",
          requirements: data.requirements || [],
          date: dateString,
          createdAt: createdAtString,
        });
      });

      return meetings;
    } catch (error) {
      console.error("Error fetching meetings:", error);
      return rejectWithValue("Error al obtener reuniones");
    }
  }
);

// THUNK: obtener una reunión por ID
export const fetchMeetingById = createAsyncThunk(
  "meetings/fetchMeetingById",
  async (meetingId: string, { rejectWithValue }) => {
    try {
      const docRef = doc(firestore, "meetings", meetingId);
      const snapshot = await getDoc(docRef);

      if (!snapshot.exists()) {
        return rejectWithValue("Reunión no encontrada");
      }

      const data = snapshot.data();
      const dateString =
        data.date instanceof Timestamp
          ? data.date.toDate().toISOString()
          : data.date || "";
      const createdAtString =
        data.createdAt instanceof Timestamp
          ? data.createdAt.toDate().toISOString()
          : data.createdAt || "";

      return {
        id: snapshot.id,
        projectId: data.projectId,
        title: data.title,
        description: data.description || "",
        audioId: data.audioId || "",
        transcription: data.transcription || "",
        requirements: data.requirements || [],
        date: dateString,
        createdAt: createdAtString,
      } as Meeting;
    } catch (error) {
      console.error("Error fetching meeting:", error);
      return rejectWithValue("Error al obtener reunión por ID");
    }
  }
);

// THUNK: actualizar una reunión
export const updateMeeting = createAsyncThunk(
  "meetings/updateMeeting",
  async (
    {
      meetingId,
      updatedData,
    }: { meetingId: string; updatedData: Partial<Meeting> },
    { rejectWithValue }
  ) => {
    try {
      const meetingRef = doc(firestore, "meetings", meetingId);
      await updateDoc(meetingRef, updatedData);

      // Retorna los datos actualizados
      return { id: meetingId, ...updatedData };
    } catch (error) {
      console.error("Error updating meeting:", error);
      return rejectWithValue("Error al actualizar reunión");
    }
  }
);

// THUNK: eliminar una reunión
export const deleteMeeting = createAsyncThunk(
  "meetings/deleteMeeting",
  async (meetingId: string, { rejectWithValue }) => {
    try {
      const meetingRef = doc(firestore, "meetings", meetingId);
      await deleteDoc(meetingRef);
      return meetingId;
    } catch (error) {
      console.error("Error deleting meeting:", error);
      return rejectWithValue("Error al eliminar reunión");
    }
  }
);

const meetingsSlice = createSlice({
  name: "meetings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createMeeting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMeeting.fulfilled, (state, action: PayloadAction<Meeting>) => {
        state.loading = false;
        state.meetings.push(action.payload);
      })
      .addCase(createMeeting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchMeetingsByProjectId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchMeetingsByProjectId.fulfilled,
        (state, action: PayloadAction<Meeting[]>) => {
          state.loading = false;
          // Reemplaza la lista de meetings con los del proyecto (o combínalos, si prefieres)
          state.meetings = action.payload;
        }
      )
      .addCase(fetchMeetingsByProjectId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // fetchMeetingById
      .addCase(fetchMeetingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMeetingById.fulfilled, (state, action: PayloadAction<Meeting>) => {
        state.loading = false;
        // Si la reunión ya existía en el array, la reemplazamos. Sino, la agregamos.
        const existingIndex = state.meetings.findIndex(
          (m) => m.id === action.payload.id
        );
        if (existingIndex !== -1) {
          state.meetings[existingIndex] = action.payload;
        } else {
          state.meetings.push(action.payload);
        }
      })
      .addCase(fetchMeetingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // updateMeeting
      .addCase(updateMeeting.fulfilled, (state, action) => {
        const updated = action.payload as Meeting;
        const idx = state.meetings.findIndex((m) => m.id === updated.id);
        if (idx !== -1) {
          state.meetings[idx] = { ...state.meetings[idx], ...updated };
        }
      })
      .addCase(updateMeeting.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // deleteMeeting
      .addCase(deleteMeeting.fulfilled, (state, action: PayloadAction<string>) => {
        state.meetings = state.meetings.filter((m) => m.id !== action.payload);
      })
      .addCase(deleteMeeting.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default meetingsSlice.reducer;