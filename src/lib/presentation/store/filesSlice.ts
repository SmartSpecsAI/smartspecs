"use client";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FilesState {
  file: File | null;
}

const initialState: FilesState = {
  file: null,
};

const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    setFile(state, action: PayloadAction<File | null>) {
      state.file = action.payload;
    },
  },
});

export const { setFile } = filesSlice.actions;
export default filesSlice.reducer;

// Exportar el selector
export const selectFile = (state: { files: FilesState }) => state.files.file; 