// src/app-lib/hooks/projects/useProjectForm.ts

import { useState, useEffect } from "react";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { AppDispatch, RootState } from "@/smartspecs/app-lib/redux/store";
import { createProject, updateProject } from "@/smartspecs/app-lib/redux/slices/ProjectsSlice";
import { Project } from "@/smartspecs/app-lib/interfaces/project";

interface UseProjectFormProps {
    project?: Project;
    onSaveSuccess?: (message: string) => void;
    onCancel?: () => void;
}

const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useProjectForm = ({
    project,
    onSaveSuccess,
    onCancel,
}: UseProjectFormProps) => {
    const dispatch = useAppDispatch();
    const { currentUser } = useAppSelector((state) => state.users);

    const [formData, setFormData] = useState<Omit<Project, "id">>({
        title: "",
        client: "",
        description: "",
        createdAt: "",
        updatedAt: "",
    });

    // Si el formulario es de edición, prellenamos los campos
    useEffect(() => {
        if (project) {
            setFormData({
                title: project.title,
                client: project.client,
                description: project.description,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt,
            });
        }
    }, [project]);

    // Manejador de inputs (tanto <input> como <textarea>)
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Manejador de envío del formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const timestamp = new Date().toISOString();
        
        if (!currentUser) {
            console.error("No hay usuario autenticado");
            return;
        }

        if (project) {
            await dispatch(
                updateProject({
                    id: project.id,
                    updatedData: {
                        ...formData,
                        updatedAt: timestamp,
                    },
                })
            );
            onSaveSuccess?.("Proyecto actualizado exitosamente");
        } else {
            await dispatch(
                createProject({
                    newProject: formData,
                    userId: currentUser.id
                })
            );
            onSaveSuccess?.("Proyecto creado exitosamente");
        }

        onCancel?.(); // Cerrar modal u otra acción post-envío
    };

    return {
        formData,
        handleInputChange,
        handleSubmit,
    };
};