"use client";
import { configureStore } from '@reduxjs/toolkit';
import filesReducer from './filesSlice';
import requirementsReducer from './requirementsSlice';
import projectsReducer from './projectsSlice';

const store = configureStore({
  reducer: {
    files: filesReducer,
    requirements: requirementsReducer,
    projects: projectsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store; 