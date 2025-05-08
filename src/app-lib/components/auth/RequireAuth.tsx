"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/smartspecs/app-lib/redux/store';

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { currentUser, isLoading } = useSelector((state: RootState) => state.users);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Short delay to allow auth state to be initialized
    const timer = setTimeout(() => {
      setIsChecking(false);
      
      // If not authenticated, redirect to login
      if (!currentUser && !isLoading) {
        router.push(`/login?returnUrl=${encodeURIComponent(window.location.pathname)}`);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [currentUser, isLoading, router]);


  // User is authenticated, render children
  return <>{children}</>;
} 