"use client";
import { ReactNode } from "react";

import { Provider } from "react-redux";
import ThemeProvider from "@/smartspecs/lib/presentation/components/layout/ThemeProvider";
import { store } from "../../../app-lib/redux";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthStateListener from "@/smartspecs/app-lib/components/auth/AuthStateListener";

interface MultiProviderProps {
  children: ReactNode;
}

export function MultiProvider({ children }: MultiProviderProps) {
  return (
    <ThemeProvider>
      <Provider store={store}>
        <ToastContainer />
        <AuthStateListener>
          {children}
        </AuthStateListener>
      </Provider>
    </ThemeProvider>
  );
}
