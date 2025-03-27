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

// NEW: Ajusta si tienes un .env con la ruta real
const FASTAPI_URL = "http://localhost:8000"; 
// Ejemplo: process.env.NEXT_PUBLIC_FASTAPI_URL || "..."

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

// --- Acciones asíncronas para Firestore (ORIGINALS) ---
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
            projectId: data.projectId || data.project_id, // manejar ambos por si acaso
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

/** 
 * (ORIGINAL) Actualiza requerimiento directamente en Firestore.
 * Queda aquí por compatibilidad, pero si deseas que también 
 * se actualice ChromaDB, usa la versión "PUT /requirements/:id".
 */
export const updateRequirementFirestoreDirect = createAsyncThunk(
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

/**
 * (ORIGINAL) Elimina requerimiento directamente en Firestore.
 * Igual que arriba, no toca ChromaDB.
 */
export const deleteRequirementFirestoreDirect = createAsyncThunk(
  "requirements/deleteRequirementFirestoreDirect",
  async (id: string, { rejectWithValue }) => {
    try {
      const requirementRef = doc(firestore, "requirements", id);
      await deleteDoc(requirementRef);
      return id;
    } catch (error) {
      console.error("Error deleting requirement (Firestore Direct):", error);
      return rejectWithValue("Error al eliminar el requerimiento");
    }
  }
);

// 5. Obtener un requerimiento por ID
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

/* 
  NEW: updateRequirement y deleteRequirement con llamadas a nuestra API de FastAPI,
  la cual se encargará de actualizar/eliminar tanto en Firestore como en ChromaDB.
*/
export const updateRequirement = createAsyncThunk(
  "requirements/updateRequirement",
  async (
    { id, updatedData }: { id: string; updatedData: Partial<Requirement> },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch(`${FASTAPI_URL}/requirements/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...updatedData, 
          // Asegúrate de incluir fields que FastAPI necesita, 
          // ej. title, description, priority. 
          // No uses "id", el ID va en la URL
        }),
      });

      if (!res.ok) {
        throw new Error(`Error actualizando requerimiento con ID: ${id}`);
      }

      const updatedReq = await res.json();
      // returned "updatedReq" debería tener un shape similar a Requirement.
      return {
        id,
        ...updatedReq,
      };
    } catch (error) {
      console.error("Error updateRequirement (FastAPI):", error);
      return rejectWithValue("Error al actualizar requerimiento en Firestore + ChromaDB");
    }
  }
);

export const deleteRequirement = createAsyncThunk(
  "requirements/deleteRequirement",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`${FASTAPI_URL}/requirements/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error(`Error eliminando requerimiento con ID: ${id}`);
      }
      return id; // Devolvemos el ID para poder quitarlo del store.
    } catch (error) {
      console.error("Error deleteRequirement (FastAPI):", error);
      return rejectWithValue("Error al eliminar requerimiento en Firestore + ChromaDB");
    }
  }
);

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

      // (ORIGINAL) Actualizar requerimiento directo en Firestore
      .addCase(updateRequirementFirestoreDirect.fulfilled, (state, action) => {
        const { id } = action.payload as Requirement;
        const index = state.requirements.findIndex((r) => r.id === id);
        if (index !== -1) {
          state.requirements[index] = { ...state.requirements[index], ...action.payload };
        }
      })
      .addCase(updateRequirementFirestoreDirect.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // (ORIGINAL) Eliminar requerimiento directo en Firestore
      .addCase(deleteRequirementFirestoreDirect.fulfilled, (state, action: PayloadAction<string>) => {
        state.requirements = state.requirements.filter((r) => r.id !== action.payload);
      })
      .addCase(deleteRequirementFirestoreDirect.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Obtener requerimiento por ID
      .addCase(fetchRequirementById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRequirementById.fulfilled, (state, action: PayloadAction<Requirement>) => {
        state.loading = false;
        const idx = state.requirements.findIndex((r) => r.id === action.payload.id);
        if (idx !== -1) {
          state.requirements[idx] = action.payload;
        } else {
          state.requirements.push(action.payload);
        }
      })
      .addCase(fetchRequirementById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // NEW: Actualizar requerimiento (Firestore + Chroma) vía FastAPI
      .addCase(updateRequirement.fulfilled, (state, action) => {
        const updatedReq = action.payload as Requirement;
        const index = state.requirements.findIndex((r) => r.id === updatedReq.id);
        if (index !== -1) {
          state.requirements[index] = { ...state.requirements[index], ...updatedReq };
        }
      })
      .addCase(updateRequirement.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // NEW: Eliminar requerimiento (Firestore + Chroma) vía FastAPI
      .addCase(deleteRequirement.fulfilled, (state, action: PayloadAction<string>) => {
        state.requirements = state.requirements.filter((r) => r.id !== action.payload);
      })
      .addCase(deleteRequirement.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default requirementSlice.reducer;