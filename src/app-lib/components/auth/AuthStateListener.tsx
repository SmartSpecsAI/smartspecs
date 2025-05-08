"use client";

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '@/smartspecs/lib/config/firebase-settings';
import { onAuthStateChanged } from 'firebase/auth';
import { syncUser, syncUserAuth } from '@/smartspecs/app-lib/redux/slices/UsersSlice';

export default function AuthStateListener({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        // Get current auth state
        const userData = await syncUserAuth();
        
        // Update Redux store
        dispatch(syncUser(userData));
        
        // Set up listener for future auth state changes
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            // User is signed in
            const userData = await syncUserAuth();
            dispatch(syncUser(userData));
          } else {
            // User is signed out
            dispatch(syncUser(null));
          }
        });
        
        setIsLoading(false);
        
        // Clean up listener on unmount
        return () => unsubscribe();
      } catch (error) {
        console.error("Auth state error:", error);
        setIsLoading(false);
      }
    };
    
    checkAuthState();
  }, [dispatch]);

  return <>{children}</>;
} 