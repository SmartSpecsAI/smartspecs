import { ReactNode } from "react";

import { ProjectsProvider } from "./ProjectsContext";
import { RequirementProvider } from "./RequirementContext";

interface MultiProviderProps {
  children: ReactNode;
}

export function MultiProvider({ children }: MultiProviderProps) {
  return (
    <ProjectsProvider>
      <RequirementProvider>{children}</RequirementProvider>
    </ProjectsProvider>
  );
}
