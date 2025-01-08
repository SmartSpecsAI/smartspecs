"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface FilesContextType {
  files: File[];
  setFiles: (files: File[]) => void;
}

const FilesContext = createContext<FilesContextType | undefined>(undefined);

export function FilesProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <FilesContext.Provider
      value={{
        files,
        setFiles,
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
