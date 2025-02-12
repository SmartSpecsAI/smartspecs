"use client";
import { ReactNode } from "react";
import { ProjectsProvider } from "./ProjectsContext";
import { RequirementProvider } from "./RequirementContext";
// import { FilesProvider } from "./FilesContext";
import { Provider } from 'react-redux';
import { store } from '../store/store';

interface MultiProviderProps {
  children: ReactNode;
}

export function MultiProvider({ children }: MultiProviderProps) {
  return (
    <Provider store={store}>
      <ProjectsProvider>
        <RequirementProvider>
          {/* <FilesProvider> */}
          {children}
          {/* </FilesProvider> */}
        </RequirementProvider>
      </ProjectsProvider>
    </Provider>
  );
}