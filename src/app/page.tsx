"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/smartspecs/app-lib/redux/store";
import LoadingSpinner from "@/smartspecs/app-lib/components/common/LoadingSpinner";

export default function Home() {
  const router = useRouter();
  const { currentUser, isLoading } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    // Esperar a que se cargue el estado de autenticación
    if (!isLoading) {
      // Redirigir basado en el estado de autenticación
      if (currentUser) {
        router.push("/projects");
      } else {
        router.push("/login");
      }
    }
  }, [currentUser, isLoading, router]);

  // Usar el componente LoadingSpinner
  return <LoadingSpinner title="Cargando SmartSpecs..." />;
}
