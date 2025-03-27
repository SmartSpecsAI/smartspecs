"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/store";
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
  name: "projects",
  initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.projects = action.payload;
    },
    setSelectedProject: (state, action: PayloadAction<Project | null>) => {
      state.selectedProject = action.payload;
    },
  },
});

export const { setProjects, setSelectedProject } = projectsSlice.actions;

export const selectProjects = (state: RootState) => state.projects.projects;
export const selectSelectedProject = (state: RootState) =>
  state.projects.selectedProject;

export const useProjects = () => {
  const dispatch = useDispatch();
  const projects = useSelector(selectProjects);
  const selectedProject = useSelector(selectSelectedProject);

  const updateProjects = (projects: Project[]) => {
    dispatch(setProjects(projects));
    console.log("PROJECTS:", projects);
  };

  const updateSelectedProject = (project: Project | null) => {
    dispatch(setSelectedProject(project));
  };

  return { projects, selectedProject, updateProjects, updateSelectedProject };
};

export default projectsSlice.reducer;
