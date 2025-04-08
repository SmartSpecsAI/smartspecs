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
import { callDifyWorkflow } from "@/smartspecs/lib/utils/dify";

/* ─────────────────────────────────────────────
 *  Tipos y estado
 * ────────────────────────────────────────────*/
export interface Meeting {
  id?: string; // id local
  meetingId: string; // id Firestore
  projectId: string;
  meetingTitle: string;
  meetingDescription: string;
  meetingTranscription: string;
  requirements: object[];
  createdAt?: string;
  updatedAt?: string;
  date?: string;
  /* Datos devueltos por Dify */
  updatedRequirementsList?: object[];
  newRequirementsList?: object[];
  newProjectContext?: string;
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

/* ─────────────────────────────────────────────
 *  Thunks
 * ────────────────────────────────────────────*/
export const createMeeting = createAsyncThunk(
  "meetings/createMeeting",
  async (
    {
      projectId,
      projectTitle,
      projectDescription,
      projectClient,
      meetingTitle,
      meetingDescription,
      meetingTranscription,
      requirementsList,
    }: {
      projectId: string;
      projectTitle: string;
      projectDescription: string;
      projectClient: string;
      meetingTitle: string;
      meetingDescription: string;
      meetingTranscription: string;
      requirementsList: object[];
    },
    { rejectWithValue }
  ) => {
    try {
      const timestamp = Timestamp.now();

      /* 1️⃣ Guardar la reunión en Firestore */
      const docRef = await addDoc(collection(firestore, "meetings"), {
        projectId,
        meetingTitle,
        meetingDescription,
        meetingTranscription,
        updatedAt: timestamp,
        createdAt: timestamp,
      });

      const meetingId = docRef.id;

      /* 2️⃣ Ejecutar el workflow de Dify */
      let updatedRequirementsList: object[] = [];
      let newRequirementsList: object[] = [];
      let newProjectContext: string | undefined;

      try {
        const wf = await callDifyWorkflow(
          projectId,
          meetingId,
          projectTitle,
          projectDescription,
          projectClient,
          meetingTitle,
          meetingDescription,
          meetingTranscription,
          requirementsList
        );

        updatedRequirementsList = wf?.updatedRequirementsList ?? [];
        newRequirementsList = wf?.newRequirementsList ?? [];
        newProjectContext = wf?.newProjectContext;
      } catch (wfErr) {
        console.error("⚠️  Workflow falló, la reunión se creó igual:", wfErr);
      }

      return {
        id: meetingId,
        meetingId,
        projectId,
        meetingTitle,
        meetingDescription,
        meetingTranscription,
        updatedRequirementsList,
        newRequirementsList,
        newProjectContext,
        requirements: [],
        createdAt: timestamp.toDate().toISOString(),
        updatedAt: timestamp.toDate().toISOString(),
      } as Meeting;
    } catch (err) {
      console.error("❌ Error creando reunión:", err);
      return rejectWithValue("Error al crear la reunión");
    }
  }
);

/* ✅ Obtener reuniones por proyecto */
export const fetchMeetingsByProjectId = createAsyncThunk(
  "meetings/fetchMeetingsByProjectId",
  async (projectId: string, { rejectWithValue }) => {
    try {
      const q = query(
        collection(firestore, "meetings"),
        where("projectId", "==", projectId)
      );
      const snap = await getDocs(q);

      const meetings: Meeting[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          meetingId: d.id,
          projectId: data.projectId,
          meetingTitle: data.meetingTitle ?? data.title ?? "",
          meetingDescription: data.meetingDescription ?? data.description ?? "",
          meetingTranscription:
            data.meetingTranscription ?? data.transcription ?? "",
          requirements: data.requirements ?? [],
          createdAt:
            data.createdAt instanceof Timestamp
              ? data.createdAt.toDate().toISOString()
              : data.createdAt,
          updatedAt:
            data.updatedAt instanceof Timestamp
              ? data.updatedAt.toDate().toISOString()
              : data.updatedAt,
        };
      });

      return meetings;
    } catch (err) {
      console.error("❌ Error obteniendo reuniones:", err);
      return rejectWithValue("Error al obtener reuniones");
    }
  }
);

/* ✅ Obtener reunión por ID */
export const fetchMeetingById = createAsyncThunk(
  "meetings/fetchMeetingById",
  async (meetingId: string, { rejectWithValue }) => {
    try {
      const ref = doc(firestore, "meetings", meetingId);
      const snap = await getDoc(ref);

      if (!snap.exists()) return rejectWithValue("Reunión no encontrada");

      const data = snap.data();
      return {
        id: snap.id,
        meetingId: snap.id,
        projectId: data.projectId,
        meetingTitle: data.meetingTitle ?? data.title ?? "",
        meetingDescription: data.meetingDescription ?? data.description ?? "",
        meetingTranscription:
          data.meetingTranscription ?? data.transcription ?? "",
        requirements: data.requirements ?? [],
        createdAt:
          data.createdAt instanceof Timestamp
            ? data.createdAt.toDate().toISOString()
            : data.createdAt,
        updatedAt:
          data.updatedAt instanceof Timestamp
            ? data.updatedAt.toDate().toISOString()
            : data.updatedAt,
      } as Meeting;
    } catch (err) {
      console.error("❌ Error obteniendo reunión:", err);
      return rejectWithValue("Error al obtener reunión");
    }
  }
);

/* 🔄 Actualizar */
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
      await updateDoc(doc(firestore, "meetings", meetingId), updatedData);
      return { meetingId, updatedData };
    } catch (err) {
      console.error("❌ Error actualizando reunión:", err);
      return rejectWithValue("Error al actualizar reunión");
    }
  }
);

/* 🗑️ Eliminar */
export const deleteMeeting = createAsyncThunk(
  "meetings/deleteMeeting",
  async (meetingId: string, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(firestore, "meetings", meetingId));
      return meetingId;
    } catch (err) {
      console.error("❌ Error eliminando reunión:", err);
      return rejectWithValue("Error al eliminar reunión");
    }
  }
);

/* ─────────────────────────────────────────────
 *  Slice
 * ────────────────────────────────────────────*/
const meetingsSlice = createSlice({
  name: "meetings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    /* loaders */
    builder
      .addCase(fetchMeetingsByProjectId.pending, (st) => {
        st.loading = true;
        st.error = null;
      })
      .addCase(fetchMeetingsByProjectId.fulfilled, (st, a: PayloadAction<Meeting[]>) => {
        st.loading = false;
        st.meetings = a.payload;
      })
      .addCase(fetchMeetingsByProjectId.rejected, (st, a) => {
        st.loading = false;
        st.error = a.payload as string;
      });

    /* get one */
    builder.addCase(fetchMeetingById.fulfilled, (st, a: PayloadAction<Meeting>) => {
      const idx = st.meetings.findIndex((m) => m.meetingId === a.payload.meetingId);
      idx === -1 ? st.meetings.push(a.payload) : (st.meetings[idx] = a.payload);
    });

    /* create */
    builder
      .addCase(createMeeting.fulfilled, (st, a: PayloadAction<Meeting>) => {
        st.meetings.push(a.payload);
      })
      .addCase(createMeeting.rejected, (st, a) => {
        st.error = a.payload as string;
      });

    /* update */
    builder.addCase(updateMeeting.fulfilled, (st, a) => {
      const idx = st.meetings.findIndex((m) => m.meetingId === a.payload.meetingId);
      if (idx !== -1) st.meetings[idx] = { ...st.meetings[idx], ...a.payload.updatedData };
    });

    /* delete */
    builder.addCase(deleteMeeting.fulfilled, (st, a: PayloadAction<string>) => {
      st.meetings = st.meetings.filter((m) => m.meetingId !== a.payload);
    });
  },
});

export default meetingsSlice.reducer;