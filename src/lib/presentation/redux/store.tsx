"use client";
import { configureStore } from "@reduxjs/toolkit";
import filesReducer from "../slides/FilesSlide";
// import projectsReducer from "../slides/ProjectsSlide";
import projectsReducer from "./slices/ProjectsSlice";
import requirementsReducer from "../slides/RequirementSlide";

export const store = configureStore({
  reducer: {
    files: filesReducer,
    // projects: projectsReducer,
    // meetings: meetingsReducer,
    projects: projectsReducer,
    requirements: requirementsReducer,
    // actions: actionsReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
