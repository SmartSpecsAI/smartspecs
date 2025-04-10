// src/app-lib/hooks/projects/useProjectActions.ts

import { useDispatch } from "react-redux";
import { AppDispatch } from "@/smartspecs/app-lib/redux/store";
import { deleteProject } from "@/smartspecs/app-lib/redux/slices/ProjectsSlice";

const useAppDispatch = () => useDispatch<AppDispatch>();

export const useProjectActions = () => {
    const dispatch = useAppDispatch();

    const removeProject = async (projectId: string) => {
        try {
            await dispatch(deleteProject(projectId));
            console.log("✅ Proyecto eliminado:", projectId);
        } catch (error) {
            console.error("❌ Error al eliminar proyecto:", error);
        }
    };

    return {
        removeProject,
    };
};