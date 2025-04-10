import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  collection,
  getDocs,
  Timestamp,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
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
  async (newProject: Omit<Project, "id">, { rejectWithValue }) => {
    try {
      const docRef = await addDoc(collection(firestore, "projects"), newProject);

      return { id: docRef.id, ...newProject };
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
      const projectRef = doc(firestore, "projects", id);

      const snapshot = await getDoc(projectRef);
      if (!snapshot.exists()) {
        return rejectWithValue("El proyecto no existe");
      }

      const updateData = {
        ...updatedData,
        updatedAt: Timestamp.now()
      };

      await updateDoc(projectRef, updateData);

      const updatedSnapshot = await getDoc(projectRef);
      const data = updatedSnapshot.data();

      return {
        id: updatedSnapshot.id,
        ...data,
        updatedAt: data?.updatedAt instanceof Timestamp ?
          data.updatedAt.toDate().toISOString() :
          data?.updatedAt
      };
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
      const projectRef = doc(firestore, "projects", id);

      await deleteDoc(projectRef);

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
      const projectRef = doc(firestore, "projects", projectId);

      const snapshot = await getDoc(projectRef);
      if (!snapshot.exists()) {
        return rejectWithValue("El proyecto no existe");
      }

      const data = snapshot.data();

      return {
        id: snapshot.id,
        title: data.title,
        client: data.client,
        description: data.description,
        createdAt:
          data.createdAt instanceof Timestamp
            ? data.createdAt.toDate().toISOString()
            : data.createdAt,
        updatedAt:
          data.updatedAt instanceof Timestamp
            ? data.updatedAt.toDate().toISOString()
            : data.updatedAt,
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

      if (!querySnapshot.empty) {
        const projects = querySnapshot.docs.map((doc) => {

          const data = doc.data();

          return {
            id: doc.id,
            title: data.title,
            client: data.client,
            description: data.description,
            createdAt:
              data.createdAt instanceof Timestamp
                ? data.createdAt.toDate().toISOString()
                : data.createdAt,
            updatedAt:
              data.updatedAt instanceof Timestamp
                ? data.updatedAt.toDate().toISOString()
                : data.updatedAt,
          } as Project;

        });

        return projects;

      } else {
        return [];
      }
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