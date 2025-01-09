"use client";
import { Requirement } from "@/smartspecs/lib/domain";
import { createContext, useContext, useState, ReactNode } from "react";

interface RequirementContextType {
  requirements: Requirement[];
  selectedRequirement: Requirement | null;
  setSelectedRequirement: (requirement: Requirement | null) => void;
  setRequirements: (requirements: Requirement[]) => void;
}

const RequirementContext = createContext<RequirementContextType | undefined>(
  undefined
);

export function RequirementProvider({ children }: { children: ReactNode }) {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [selectedRequirement, setSelectedRequirement] =
    useState<Requirement | null>(null);

  return (
    <RequirementContext.Provider
      value={{
        requirements,
        selectedRequirement,
        setSelectedRequirement,
        setRequirements,
      }}
    >
      {children}
    </RequirementContext.Provider>
  );
}

export function useRequirements() {
  const context = useContext(RequirementContext);
  if (context === undefined) {
    throw new Error(
      "useRequirements must be used within a RequirementProvider"
    );
  }
  return context;
}
