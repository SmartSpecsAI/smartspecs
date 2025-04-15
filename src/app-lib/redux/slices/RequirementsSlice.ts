import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { firestore } from "@/smartspecs/lib/config/firebase-settings";
import { toISODate } from "@/smartspecs/app-lib/utils/firestoreTimeStamps";
import { Requirement } from "@/smartspecs/app-lib/interfaces/requirement";
import { Status } from "@/smartspecs/lib/domain/entities/Status";

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

// Crear un nuevo requerimiento
export const createRequirement = createAsyncThunk(
  "requirements/createRequirement",
  async (requirement: Omit<Requirement, "id">, { rejectWithValue }) => {
    try {
      const timestamp = Timestamp.now();

      const docRef = await addDoc(collection(firestore, "requirements"), {
        ...requirement,
        createdAt: timestamp,
        updatedAt: timestamp,
      });

      return {
        id: docRef.id,
        ...requirement,
        createdAt: toISODate(timestamp),
        updatedAt: toISODate(timestamp),
      } as Requirement;
    } catch (error) {
      console.error("Error creating requirement:", error);
      return rejectWithValue("Error al crear requerimiento");
    }
  }
);

// Actualizar requerimiento
export const updateRequirement = createAsyncThunk(
  "requirements/updateRequirement",
  async (
    { id, updatedData }: { id: string; updatedData: Partial<Requirement> },
    { rejectWithValue }
  ) => {
    try {
      const docRef = doc(firestore, "requirements", id);
      const timestamp = Timestamp.now();

      await updateDoc(docRef, {
        ...updatedData,
        updatedAt: timestamp,
      });

      const snap = await getDoc(docRef);
      if (!snap.exists()) {
        return rejectWithValue("El requerimiento no existe");
      }

      const data = snap.data();
      return {
        id: snap.id,
        projectId: data.projectId || data.project_id,
        title: data.title || "Untitled",
        description: data.description || "",
        priority: data.priority || "medium",
        status: data.status || Status.IN_PROGRESS,
        createdAt: toISODate(data.createdAt),
        updatedAt: toISODate(data.updatedAt),
      } as Requirement;
    } catch (error) {
      console.error("Error obteniendo requerimiento por ID:", error);
      return rejectWithValue("Error al obtener requerimiento por ID");
    }
  }
);

// Eliminar un requerimiento
export const deleteRequirement = createAsyncThunk(
  "requirements/deleteRequirement",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(firestore, "requirements", id));
      return id;
    } catch (error) {
      console.error("Error deleting requirement:", error);
      return rejectWithValue("Error al eliminar el requerimiento");
    }
  }
);

// Obtener un requerimiento por ID
export const getRequirement = createAsyncThunk(
  "requirements/getRequirement",
  async (requirementId: string, { rejectWithValue }) => {
    try {
      const snap = await getDoc(doc(firestore, "requirements", requirementId));

      if (!snap.exists()) {
        return rejectWithValue("El requerimiento no existe");
      }

      const data = snap.data();
      return {
        id: snap.id,
        projectId: data.projectId || data.project_id,
        title: data.title || "Untitled",
        description: data.description || "",
        priority: data.priority || "medium",
        status: data.status || "pending",
        createdAt: toISODate(data.createdAt),
        updatedAt: toISODate(data.updatedAt),
      } as Requirement;
    } catch (error) {
      console.error("Error obteniendo requerimiento por ID:", error);
      return rejectWithValue("Error al obtener requerimiento por ID");
    }
  }
);

// Obtener requerimientos por proyecto
export const getRequirementsByProject = createAsyncThunk(
  "requirements/getRequirementsByProject",
  async (projectId: string, { rejectWithValue }) => {
    try {
      const q = query(
        collection(firestore, "requirements"),
        where("projectId", "==", projectId)
      );

      const snap = await getDocs(q);

      const requirements = snap.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          projectId: data.projectId || data.project_id,
          title: data.title || "Untitled",
          description: data.description || "",
          priority: data.priority || "medium",
          status: data.status || Status.IN_PROGRESS,
          createdAt: toISODate(data.createdAt),
          updatedAt: toISODate(data.updatedAt),
        } as Requirement;
      });

      return requirements;
    } catch (error) {
      console.error("Error fetching requirements:", error);
      return rejectWithValue("Error al obtener requerimientos");
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
      // Crear requerimiento
      .addCase(createRequirement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRequirement.fulfilled, (state, action: PayloadAction<Requirement>) => {
        state.requirements.push(action.payload);
        state.loading = false;
      })
      .addCase(createRequirement.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      // Actualizar requerimiento
      .addCase(updateRequirement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRequirement.fulfilled, (state, action: PayloadAction<Requirement>) => {
        const index = state.requirements.findIndex((req) => req.id === action.payload.id);
        if (index !== -1) {
          state.requirements[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateRequirement.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      // Eliminar requerimiento
      .addCase(deleteRequirement.fulfilled, (state, action: PayloadAction<string>) => {
        state.requirements = state.requirements.filter((r) => r.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteRequirement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRequirement.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      // Obtener uno
      .addCase(getRequirement.fulfilled, (state, action: PayloadAction<Requirement>) => {
        const idx = state.requirements.findIndex((r) => r.id === action.payload.id);
        if (idx !== -1) {
          state.requirements[idx] = action.payload;
        } else {
          state.requirements.push(action.payload);
        }
        state.loading = false;
      })
      .addCase(getRequirement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRequirement.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      // Obtener por proyecto
      .addCase(getRequirementsByProject.fulfilled, (state, action: PayloadAction<Requirement[]>) => {
        state.requirements = action.payload;
        state.loading = false;
      })
      .addCase(getRequirementsByProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRequirementsByProject.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export default requirementSlice.reducer;