import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import {
  getTimestampObject,
  getUpdatedTimestamp,
  toISODate,
} from "@/smartspecs/app-lib/utils/firestoreTimeStamps";
import { firestore } from "@/smartspecs/lib/config/firebase-settings";

export interface Project {
  id: string;
  title: string;
  client: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectState {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  projects: [],
  loading: false,
  error: null,
};

// Crear Proyecto
export const createProject = createAsyncThunk(
  "projects/createProject",
  async (
    newProject: Omit<Project, "id" | "createdAt" | "updatedAt">,
    { rejectWithValue }
  ) => {
    try {
      const timestamps = getTimestampObject();
      const docRef = await addDoc(collection(firestore, "projects"), {
        ...newProject,
        ...timestamps,
      });

      return {
        id: docRef.id,
        ...newProject,
        createdAt: toISODate(timestamps.createdAt),
        updatedAt: toISODate(timestamps.updatedAt),
      };
    } catch (error) {
      console.error("Error al crear el proyecto:", error);
      return rejectWithValue("Error al crear el proyecto");
    }
  }
);

// Actualizar Proyecto
export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async (
    { id, updatedData }: { id: string; updatedData: Partial<Project> },
    { rejectWithValue }
  ) => {
    try {
      const timestamp = getUpdatedTimestamp();
      const updateData = { ...updatedData, ...timestamp };

      const projectRef = doc(firestore, "projects", id);
      await updateDoc(projectRef, updateData);

      const updatedSnapshot = await getDoc(projectRef);
      const data = updatedSnapshot.data();

      return {
        id: updatedSnapshot.id,
        title: data?.title ?? "",
        client: data?.client ?? "",
        description: data?.description ?? "",
        createdAt: toISODate(data?.createdAt),
        updatedAt: toISODate(data?.updatedAt),
      } as Project;
    } catch (error) {
      console.error("Error al actualizar el proyecto:", error);
      return rejectWithValue("Error al actualizar el proyecto");
    }
  }
);

// Eliminar Proyecto
export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(firestore, "projects", id));
      return id;
    } catch (error) {
      console.error("Error al eliminar el proyecto:", error);
      return rejectWithValue("Error al eliminar el proyecto");
    }
  }
);

// Obtener Proyecto
export const getProject = createAsyncThunk(
  "projects/getProject",
  async (projectId: string, { rejectWithValue }) => {
    try {
      const snapshot = await getDoc(doc(firestore, "projects", projectId));
      if (!snapshot.exists()) {
        return rejectWithValue("El proyecto no existe");
      }

      const data = snapshot.data();
      return {
        id: snapshot.id,
        title: data.title,
        client: data.client,
        description: data.description,
        createdAt: toISODate(data.createdAt),
        updatedAt: toISODate(data.updatedAt),
      } as Project;
    } catch (error) {
      console.error("Error obteniendo proyecto por ID:", error);
      return rejectWithValue("Error al obtener proyecto por ID");
    }
  }
);

// Obtener Todos los Proyectos
export const getProjects = createAsyncThunk(
  "projects/getProjects",
  async (_, { rejectWithValue }) => {
    try {
      const querySnapshot = await getDocs(collection(firestore, "projects"));
      return querySnapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          title: data.title,
          client: data.client,
          description: data.description,
          createdAt: toISODate(data.createdAt),
          updatedAt: toISODate(data.updatedAt),
        } as Project;
      });
    } catch (error) {
      console.error("Error al obtener proyectos:", error);
      return rejectWithValue("Error al obtener proyectos");
    }
  }
);


const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ===== GET PROJECT =====
      .addCase(getProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProject.fulfilled, (state, action: PayloadAction<Project>) => {
        state.loading = false;
        const idx = state.projects.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) {
          state.projects[idx] = action.payload;
        } else {
          state.projects.push(action.payload);
        }
      })
      .addCase(getProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ===== GET PROJECTS =====
      .addCase(getProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProjects.fulfilled, (state, action: PayloadAction<Project[]>) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(getProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ===== CREATE PROJECT =====
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action: PayloadAction<Project>) => {
        state.projects.push(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // ===== UPDATE PROJECT =====
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const { id } = action.payload as Project;
        const index = state.projects.findIndex((p) => p.id === id);
        if (index !== -1) {
          state.projects[index] = { ...state.projects[index], ...action.payload };
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // ===== DELETE PROJECT =====
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action: PayloadAction<string>) => {
        state.projects = state.projects.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default projectSlice.reducer;