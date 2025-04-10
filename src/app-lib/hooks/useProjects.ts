import { useEffect } from "react";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { AppDispatch } from "@/smartspecs/app-lib/redux/store";
import { RootState } from "@/smartspecs/app-lib/redux/store";
import { fetchProjects } from "@/smartspecs/app-lib/redux/slices/ProjectsSlice";

// Hooks tipados
const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useProjects = () => {
  const dispatch = useAppDispatch();
  const { projects, loading, error } = useAppSelector((state) => state.projects);

  // Al montar, busca todos los proyectos
  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  return { projects, loading, error };
}; 