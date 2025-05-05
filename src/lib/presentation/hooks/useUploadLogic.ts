import { useState, useCallback, useEffect } from "react";

interface FileInfo {
  name: string;
  duration: number;
}

const useUploadLogic = (uploadProps: any) => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [showAudio, setShowAudio] = useState(false);
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!uploadProps.file) {
      return resetState();
    }

    const url = URL.createObjectURL(uploadProps.file);
    setAudioUrl(url);
    handleAudioLoad(uploadProps.file, url);
    setShowAudio(true);
  }, [uploadProps.file]);

  const resetState = useCallback(() => {
    setAudioUrl(null);
    setShowAudio(false);
    setFileInfo(null);
    setShowConfirm(false);
  }, []);

  const handleAudioLoad = useCallback((file: File, url: string) => {
    const audio = new Audio(url);
    audio.addEventListener("loadedmetadata", () => {
      setFileInfo({
        name: file.name,
        duration: audio.duration,
      });
    });
  }, []);

  const handleUploadChange = useCallback(
    async (info: any) => {
      if (info.file.status === "done") {
        const file = info.file.originFileObj;
        const url = URL.createObjectURL(file);

        setAudioUrl(url);
        handleAudioLoad(file, url);
        setShowAudio(true);
        await uploadProps.onChange?.(info);
      } else if (info.fileList.length === 0) {
        resetState();
      }
    },
    [uploadProps, handleAudioLoad, resetState]
  );

  return {
    audioUrl,
    showAudio,
    fileInfo,
    showConfirm,
    resetState,
    handleUploadChange,
    setShowConfirm,
  };
};

export default useUploadLogic; 