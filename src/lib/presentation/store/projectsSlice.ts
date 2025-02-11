"use client";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Project } from "@/smartspecs/lib/domain";

interface ProjectsState {
  projects: Project[];
  selectedProject: Project | null;
}

const initialState: ProjectsState = {
  projects: [],
  selectedProject: null,
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProjects(state, action: PayloadAction<Project[]>) {
      state.projects = action.payload;
    },
    setSelectedProject(state, action: PayloadAction<Project | null>) {
      state.selectedProject = action.payload;
    },
  },
});

export const { setProjects, setSelectedProject } = projectsSlice.actions;
export default projectsSlice.reducer; 