"use client";
import { ReactNode } from "react";

import { Provider } from "react-redux";
import ThemeProvider from "@/smartspecs/lib/presentation/components/layout/ThemeProvider";
import { store } from "../redux";

interface MultiProviderProps {
  children: ReactNode;
}

export function MultiProvider({ children }: MultiProviderProps) {
  return (
    <ThemeProvider>
      <Provider store={store}>{children}</Provider>
    </ThemeProvider>
  );
}
