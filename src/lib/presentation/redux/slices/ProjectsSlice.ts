import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { collection, getDocs, Timestamp, addDoc } from "firebase/firestore";
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

// Estado inicial
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

// Acción para obtener proyectos y convertir timestamps
export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching projects from Firestore...");
      const querySnapshot = await getDocs(collection(firestore, "projects"));

      if (!querySnapshot.empty) {
        const projects = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          console.log(`Project ${doc.id}:`, data);

          return {
            id: doc.id,
            title: data.title || "Untitled",
            client: data.client || "Unknown",
            description: data.description || "",
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
            updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt,
            status: data.status || "pending",
          };
        });

        return projects;
      } else {
        console.log("No projects found.");
        return [];
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      return rejectWithValue("Error al obtener proyectos");
    }
  }
);

// Acción para crear un nuevo proyecto y guardarlo en Firebase
export const createProject = createAsyncThunk(
  "projects/createProject",
  async (newProject: Omit<Project, 'id'>, { rejectWithValue }) => {
    try {
    //   console.log("Creating a new project in Firestore...");
      const docRef = await addDoc(collection(firestore, "projects"), newProject);
    //   console.log(`Project created with ID: ${docRef.id}`);
      return { id: docRef.id, ...newProject };
    } catch (error) {
      console.error("Error creating project:", error);
      return rejectWithValue("Error al crear el proyecto");
    }
  }
);

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      .addCase(createProject.fulfilled, (state, action: PayloadAction<Project>) => {
        state.projects.push(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default projectSlice.reducer;