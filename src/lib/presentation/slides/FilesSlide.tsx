"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../app-lib/redux/store";

interface FilesState {
  file: File | null;
}

const initialState: FilesState = {
  file: null,
};

const filesSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    setFile: (state, action: PayloadAction<File | null>) => {
      state.file = action.payload;
    },
  },
});

export const { setFile } = filesSlice.actions;

export const selectFile = (state: RootState) => state.files.file;

export const useFiles = () => {
  const dispatch = useDispatch();
  const file = useSelector(selectFile);

  const updateFile = (file: File | null) => {
    dispatch(setFile(file));
  };

  return { file, updateFile };
};

export default filesSlice.reducer;
