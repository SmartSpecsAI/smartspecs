import { ReactNode } from "react";

import { ProjectsProvider } from "./ProjectsContext";
import { RequirementProvider } from "./RequirementContext";
import { FilesProvider } from "./FilesContext";

interface MultiProviderProps {
  children: ReactNode;
}

export function MultiProvider({ children }: MultiProviderProps) {
  return (
    <ProjectsProvider>
      <RequirementProvider>
        <FilesProvider>{children}</FilesProvider>
      </RequirementProvider>
    </ProjectsProvider>
  );
}
