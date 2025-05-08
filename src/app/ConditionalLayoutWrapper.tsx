"use client";

import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '../app-lib/redux/store';
import { AppLayout } from '@/smartspecs/lib/presentation';

// Rutas que no requieren el layout principal
const noLayoutRoutes = ['/login', '/register'];

interface ConditionalLayoutWrapperProps {
  children: React.ReactNode;
}

export default function ConditionalLayoutWrapper({ children }: ConditionalLayoutWrapperProps) {
  const pathname = usePathname();
  const { currentUser } = useSelector((state: RootState) => state.users);
  
  // SOLO LÓGICA DE LAYOUT - SIN REDIRECCIONES
  
  // Si estamos en rutas de autenticación, no aplicamos layout
  if (noLayoutRoutes.includes(pathname || '')) {
    return <>{children}</>;
  }
  
  // Para todas las demás rutas, aplicamos el layout principal si hay usuario
  if (currentUser) {
    return <AppLayout>{children}</AppLayout>;
  }
  
  // Si llegamos aquí, simplemente renderizamos el contenido sin layout
  // Las propias páginas manejarán la autenticación y redirección
  return <>{children}</>;
} 