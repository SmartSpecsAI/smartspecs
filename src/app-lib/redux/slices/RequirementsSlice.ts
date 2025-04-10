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
  query,
  where,
} from "firebase/firestore";
import { firestore } from "@/smartspecs/lib/config/firebase-settings";

export interface Requirement {
  id: string;
  projectId: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in_progress" | "completed";
  createdAt: string;
  updatedAt: string;
}

interface RequirementState {
  requirements: Requirement[];
  loading: boolean;
  error: string | null;
}

const initialState: RequirementState = {
  requirements: [],
  loading: false,
  error: null,
};

// Obtener todos los requerimientos
export const fetchAllRequirements = createAsyncThunk(
  "requirements/fetchAllRequirements",
  async (_, { rejectWithValue }) => {
    try {
      const querySnapshot = await getDocs(collection(firestore, "requirements"));

      if (!querySnapshot.empty) {
        const requirements = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            projectId: data.projectId || data.project_id,
            title: data.title || "Untitled",
            description: data.description || "",
            priority: data.priority || "medium",
            status: data.status || "pending",
            createdAt:
              data.createdAt instanceof Timestamp
                ? data.createdAt.toDate().toISOString()
                : data.createdAt,
            updatedAt:
              data.updatedAt instanceof Timestamp
                ? data.updatedAt.toDate().toISOString()
                : data.updatedAt,
          } as Requirement;
        });

        console.log("✅ Todos los requerimientos:", requirements);
        return requirements;
      } else {
        return [];
      }
    } catch (error) {
      console.error("❌ Error obteniendo requerimientos:", error);
      return rejectWithValue("Error al obtener requerimientos");
    }
  }
);

// Obtener requerimientos por proyecto
export const fetchRequirementsByProjectId = createAsyncThunk(
  "requirements/fetchRequirementsByProjectId",
  async (projectId: string, { rejectWithValue }) => {
    try {
      const q = query(collection(firestore, "requirements"), where("project_id", "==", projectId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const requirements = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            projectId: data.projectId || data.project_id,
            title: data.title || "Untitled",
            description: data.description || "",
            priority: data.priority || "medium",
            status: data.status || "pending",
            createdAt:
              data.createdAt instanceof Timestamp
                ? data.createdAt.toDate().toISOString()
                : data.createdAt,
            updatedAt:
              data.updatedAt instanceof Timestamp
                ? data.updatedAt.toDate().toISOString()
                : data.updatedAt,
          } as Requirement;
        });
        console.log("requirements", requirements);
        return requirements;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching requirements:", error);
      return rejectWithValue("Error al obtener requerimientos");
    }
  }
);

// Obtener un requerimiento por ID
export const fetchRequirementById = createAsyncThunk(
  "requirements/fetchRequirementById",
  async (requirementId: string, { rejectWithValue }) => {
    try {
      const requirementRef = doc(firestore, "requirements", requirementId);
      const snapshot = await getDoc(requirementRef);
      
      if (!snapshot.exists()) {
        return rejectWithValue("El requerimiento no existe");
      }
      
      const data = snapshot.data();
      return {
        id: snapshot.id,
        projectId: data.projectId || data.project_id,
        title: data.title || "Untitled",
        description: data.description || "",
        priority: data.priority || "medium",
        status: data.status || "pending",
        createdAt:
          data.createdAt instanceof Timestamp
            ? data.createdAt.toDate().toISOString()
            : data.createdAt,
        updatedAt:
          data.updatedAt instanceof Timestamp
            ? data.updatedAt.toDate().toISOString()
            : data.updatedAt,
      } as Requirement;
    } catch (error) {
      console.error("Error obteniendo requerimiento por ID:", error);
      return rejectWithValue("Error al obtener requerimiento por ID");
    }
  }
);

// Crear un nuevo requerimiento
export const createRequirement = createAsyncThunk(
  "requirements/createRequirement",
  async (newRequirement: Omit<Requirement, "id" | "createdAt" | "updatedAt">, { rejectWithValue }) => {
    try {
      const timestamp = Timestamp.now();
      const requirementData = {
        ...newRequirement,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      const docRef = await addDoc(collection(firestore, "requirements"), requirementData);
      return {
        id: docRef.id,
        ...requirementData,
        createdAt: timestamp.toDate().toISOString(),
        updatedAt: timestamp.toDate().toISOString(),
      };
    } catch (error) {
      console.error("Error creating requirement:", error);
      return rejectWithValue("Error al crear el requerimiento");
    }
  }
);

// Actualizar un requerimiento
export const updateRequirement = createAsyncThunk(
  "requirements/updateRequirementFirestoreDirect",
  async (
    { id, updatedData }: { id: string; updatedData: Partial<Requirement> },
    { rejectWithValue }
  ) => {
    try {
      const requirementRef = doc(firestore, "requirements", id);
      const updateData = {
        ...updatedData,
        updatedAt: Timestamp.now(),
      };
      await updateDoc(requirementRef, updateData);
      return {
        id,
        ...updateData,
        updatedAt: (updateData.updatedAt as Timestamp).toDate().toISOString(),
      };
    } catch (error) {
      console.error("Error updating requirement (Firestore Direct):", error);
      return rejectWithValue("Error al actualizar el requerimiento");
    }
  }
);

// Eliminar un requerimiento
export const deleteRequirement = createAsyncThunk(
  "requirements/deleteRequirement",
  async (id: string, { rejectWithValue }) => {
    try {
      const requirementRef = doc(firestore, "requirements", id);
      await deleteDoc(requirementRef);
      return id;
    } catch (error) {
      console.error("Error deleting requirement:", error);
      return rejectWithValue("Error al eliminar el requerimiento");
    }
  }
);

// Slice
const requirementSlice = createSlice({
  name: "requirements",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Obtener lista de requerimientos
      .addCase(fetchAllRequirements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllRequirements.fulfilled, (state, action: PayloadAction<Requirement[]>) => {
        state.loading = false;
        state.requirements = action.payload;
      })
      .addCase(fetchAllRequirements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Crear requerimiento
      .addCase(createRequirement.fulfilled, (state, action: PayloadAction<Requirement>) => {
        state.requirements.push(action.payload);
      })
      .addCase(createRequirement.rejected, (state, action) => {
        state.error = action.payload as string;
      })


      // Actualizar en Firestore
      .addCase(updateRequirement.fulfilled, (state, action) => {
        const { id } = action.payload as Requirement;
        const index = state.requirements.findIndex((r) => r.id === id);
        if (index !== -1) {
          state.requirements[index] = { ...state.requirements[index], ...action.payload };
        }
      })
      .addCase(updateRequirement.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Eliminar en Firestore
      .addCase(deleteRequirement.fulfilled, (state, action: PayloadAction<string>) => {
        state.requirements = state.requirements.filter((r) => r.id !== action.payload);
      })
      .addCase(deleteRequirement.rejected, (state, action) => {
        state.error = action.payload as string;
      })


  },
});

export default requirementSlice.reducer;