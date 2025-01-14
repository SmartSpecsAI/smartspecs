"use client";
import { useState } from "react";
import { useFilesContext } from "../contexts/FilesContext";
import { getInjection } from "@/smartspecs/di/container";

export function useFilesData() {
  const { file, setFile } = useFilesContext();
  const uploadFileUseCase = getInjection("IUploadFileUseCase");
  const transcriptAudioUseCase = getInjection("ITranscriptAudioUseCase");
  const getFileUrlUseCase = getInjection("IGetFileUrlUseCase");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [transcribingLoading, setTranscribingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcriptionError, setTranscriptionError] = useState<string | null>(
    null
  );
  const [transcription, setTranscription] = useState<string>("");

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

  const getFileUrl = async (path: string): Promise<string> => {
    try {
      const url = await getFileUrlUseCase.execute(path);
      return url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get file URL");
      return "";
    }
  };

  const transcriptAudio = async (file: File) => {
    setTranscribingLoading(true);
    setTranscriptionError(null);
    try {
      const result = await transcriptAudioUseCase.execute(file);
      console.log("TRANSCRIPCION::::", result);
      setTranscription(result);
      return result;
    } catch (err) {
      setTranscriptionError(
        err instanceof Error ? err.message : "Failed to transcribe audio"
      );
      return "";
    } finally {
      setTranscribingLoading(false);
    }
  };

  return {
    file,
    setFile,
    uploadFile,
    uploadedFiles,
    transcription,
    setTranscription,
    transcriptAudio,
    getFileUrl,
    loading,
    transcribingLoading,
    error,
    transcriptionError,
  };
}
