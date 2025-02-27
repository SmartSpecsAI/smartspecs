"use client";

import { configureStore } from "@reduxjs/toolkit";
import filesReducer from "../slides/FilesSlide";
import projectsReducer from "./slices/ProjectsSlice";
import requirementsReducer from "../slides/RequirementSlide";

export const store = configureStore({
  reducer: {
    files: filesReducer,
    projects: projectsReducer,
    requirements: requirementsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;