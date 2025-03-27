"use client";

import { configureStore } from "@reduxjs/toolkit";
import projectsReducer from "./slices/ProjectsSlice";
import requirementsReducer from "./slices/RequirementsSlice";
import meetingsReducer from "./slices/MeetingsSlice";

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    requirements: requirementsReducer,
    meetings: meetingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;