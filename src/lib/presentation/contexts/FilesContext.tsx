"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface FilesContextType {
  file: File | null;
  setFile: (file: File | null) => void;
}

const FilesContext = createContext<FilesContextType | undefined>(undefined);

export function FilesProvider({ children }: { children: ReactNode }) {
  const [file, setFile] = useState<File | null>(null);

  return (
    <FilesContext.Provider
      value={{
        file,
        setFile,
      }}
    >
      {children}
    </FilesContext.Provider>
  );
}

export function useFilesContext() {
  const context = useContext(FilesContext);
  if (context === undefined) {
    throw new Error("useFiles must be used within a FilesProvider");
  }
  return context;
}
