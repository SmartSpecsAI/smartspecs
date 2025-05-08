import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { auth, firestore } from '@/smartspecs/lib/config/firebase-settings';
import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, setDoc, Timestamp, getDoc } from 'firebase/firestore';

// Types
interface User {
  id: string;
  email: string;
  name: string;
}

interface UserState {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  registrationSuccess: boolean;
}

// Initial state
const initialState: UserState = {
  currentUser: null,
  isLoading: false,
  error: null,
  registrationSuccess: false
};

// Async thunks
export const loginUser = createAsyncThunk(
  'users/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // Firebase authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Return user data
      return {
        id: user.uid,
        email: user.email || email,
        name: user.displayName || email.split('@')[0]
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'users/register',
  async (
    { email, password, name }: { email: string; password: string; name: string },
    { rejectWithValue }
  ) => {
    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update profile with name
      await updateProfile(user, { displayName: name });
      
      // Save user data to Firestore
      await setDoc(doc(firestore, "users", user.uid), {
        email: user.email,
        name: name,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      
      return {
        id: user.uid,
        email: user.email || email,
        name: name
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

// Helper function to check if current user exists and redirect accordingly
export const syncUserAuth = () => {
  return new Promise<User | null>((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe();
      
      if (user) {
        // Get user data from Firestore
        try {
          const userDoc = await getDoc(doc(firestore, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            resolve({
              id: user.uid,
              email: user.email || userData.email,
              name: user.displayName || userData.name
            });
          } else {
            resolve({
              id: user.uid,
              email: user.email || '',
              name: user.displayName || ''
            });
          }
        } catch (error) {
          console.error("Error getting user data:", error);
          resolve({
            id: user.uid,
            email: user.email || '',
            name: user.displayName || ''
          });
        }
      } else {
        resolve(null);
      }
    });
  });
};

// Firebase logout function
export const logoutUserFromFirebase = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error("Error signing out: ", error);
    return false;
  }
};

// Slice
const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    logoutUser: (state) => {
      // This will be called after Firebase signOut
      state.currentUser = null;
    },
    resetRegistration: (state) => {
      state.registrationSuccess = false;
      state.error = null;
    },
    syncUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
      state.isLoading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.currentUser = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.registrationSuccess = false;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.registrationSuccess = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.registrationSuccess = false;
      });
  },
});

export const { logoutUser, resetRegistration, syncUser } = usersSlice.actions;
export default usersSlice.reducer;