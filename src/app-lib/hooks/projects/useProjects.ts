// src/app-lib/hooks/projects/useProjects.ts

import { useEffect } from "react";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { AppDispatch, RootState } from "@/smartspecs/app-lib/redux/store";
import { getProjects } from "@/smartspecs/app-lib/redux/slices/ProjectsSlice";

// Tipado para el dispatch y selector
const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useProjects = () => {
  const dispatch = useAppDispatch();

  const { projects, loading, error } = useAppSelector((state) => state.projects);

  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  return {
    projects,
    loading,
    error,
  };
};