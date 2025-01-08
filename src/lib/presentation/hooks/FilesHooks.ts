"use client";
import { useState } from "react";
import { useFilesContext } from "../contexts/FilesContext";
import { getInjection } from "@/di/container";

export function useFilesData() {
  const { files, setFiles } = useFilesContext();
  const uploadFileUseCase = getInjection("IUploadFileUseCase");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File, path: string) => {
    setLoading(true);
    setError(null);
    try {
      await uploadFileUseCase.execute(file, path);
      setUploadedFiles((prev) => [...prev, file]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload file");
    } finally {
      setLoading(false);
    }
  };

  return {
    files,
    setFiles,
    uploadFile,
    uploadedFiles,
    loading,
    error,
  };
}
