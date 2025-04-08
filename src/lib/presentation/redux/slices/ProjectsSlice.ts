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
  status: "pending" | "approved" | "rejected";
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

// 1. Obtener todos los proyectos
export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (_, { rejectWithValue }) => {
    try {
      const querySnapshot = await getDocs(collection(firestore, "projects"));
      if (!querySnapshot.empty) {
        const projects = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || "Untitled",
            client: data.client || "Unknown",
            description: data.description || "",
            createdAt:
              data.createdAt instanceof Timestamp
                ? data.createdAt.toDate().toISOString()
                : data.createdAt,
            updatedAt:
              data.updatedAt instanceof Timestamp
                ? data.updatedAt.toDate().toISOString()
                : data.updatedAt,
            status: data.status || "pending",
          } as Project;
        });
        return projects;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      return rejectWithValue("Error al obtener proyectos");
    }
  }
);

// 2. Crear un nuevo proyecto
export const createProject = createAsyncThunk(
  "projects/createProject",
  async (newProject: Omit<Project, "id">, { rejectWithValue }) => {
    try {
      // 1) Creamos el documento en Firestore
      const docRef = await addDoc(collection(firestore, "projects"), newProject);

      return { id: docRef.id, ...newProject };
    } catch (error) {
      console.error("Error creating project:", error);
      return rejectWithValue("Error al crear el proyecto");
    }
  }
);

// 3. Actualizar un proyecto
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

      // Añadir updatedAt si no está incluido en updatedData
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
      console.error("Error updating project:", error);
      return rejectWithValue("Error al actualizar el proyecto");
    }
  }
);

// 4. Eliminar un proyecto
export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async (id: string, { rejectWithValue }) => {
    try {
      // 1) Borrar el proyecto en Firestore
      const projectRef = doc(firestore, "projects", id);
      await deleteDoc(projectRef);

      return id;
    } catch (error) {
      console.error("Error deleting project:", error);
      return rejectWithValue("Error al eliminar el proyecto");
    }
  }
);

// 5. Obtener un proyecto por ID
export const fetchProjectById = createAsyncThunk(
  "projects/fetchProjectById",
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
        title: data.title || "Untitled",
        client: data.client || "Unknown",
        description: data.description || "",
        createdAt:
          data.createdAt instanceof Timestamp
            ? data.createdAt.toDate().toISOString()
            : data.createdAt,
        updatedAt:
          data.updatedAt instanceof Timestamp
            ? data.updatedAt.toDate().toISOString()
            : data.updatedAt,
        status: data.status || "pending",
      } as Project;
    } catch (error) {
      console.error("Error obteniendo proyecto por ID:", error);
      return rejectWithValue("Error al obtener proyecto por ID");
    }
  }
);

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Obtener lista de proyectos
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action: PayloadAction<Project[]>) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Crear proyecto
      .addCase(createProject.fulfilled, (state, action: PayloadAction<Project>) => {
        state.projects.push(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Actualizar proyecto
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

      // Eliminar proyecto
      .addCase(deleteProject.fulfilled, (state, action: PayloadAction<string>) => {
        state.projects = state.projects.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Obtener proyecto por ID
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action: PayloadAction<Project>) => {
        state.loading = false;
        const idx = state.projects.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) {
          state.projects[idx] = action.payload;
        } else {
          state.projects.push(action.payload);
        }
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default projectSlice.reducer;