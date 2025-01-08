"use client";
import { Upload, Button, Tag, Typography } from "antd";
import {
  UploadOutlined,
  SoundOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useState, useCallback, useEffect } from "react";

interface FileInfo {
  name: string;
  duration: number;
}

interface UploadStepProps {
  uploadProps: any;
}

const { Title, Text } = Typography;

const UploadIcon = () => (
  <p className="ant-upload-drag-icon">
    <UploadOutlined />
  </p>
);

const UploadText = () => (
  <p className="ant-upload-text">Click or drag audio file to upload</p>
);

const UploadHint = () => (
  <p className="ant-upload-hint">Support for single audio file upload</p>
);

export const UploadStep: React.FC<UploadStepProps> = ({ uploadProps }) => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [showAudio, setShowAudio] = useState(false);
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (uploadProps.file) {
      const url = URL.createObjectURL(uploadProps.file);
      setAudioUrl(url);
      handleAudioLoad(uploadProps.file, url);
      setShowAudio(true);
    }
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
    (info: any) => {
      uploadProps.onChange?.(info);

      if (info.file.status === "done") {
        const file = info.file.originFileObj;
        const url = URL.createObjectURL(file);
        setAudioUrl(url);
        handleAudioLoad(file, url);
        setShowAudio(true);
      } else if (info.fileList.length === 0) {
        resetState();
      }
    },
    [uploadProps, handleAudioLoad, resetState]
  );

  const formatDuration = useCallback((seconds: number): string => {
    if (seconds < 60) {
      return `${Math.floor(seconds)} sec`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")} mins`;
  }, []);

  const handleUploadNewClick = () => {
    setShowConfirm(true);
  };

  const enhancedUploadProps = {
    ...uploadProps,
    onChange: handleUploadChange,
  };

  return (
    <div>
      {!audioUrl ? (
        <Upload.Dragger {...enhancedUploadProps}>
          <UploadIcon />
          <UploadText />
          <UploadHint />
        </Upload.Dragger>
      ) : (
        <div>
          {fileInfo && (
            <div className="mb-3 bg-gray-100 p-4 rounded-lg">
              <Title level={5} className="mb-2 text-blue-500">
                Audio File Details
              </Title>
              <div className="flex flex-wrap gap-2">
                <Tag
                  icon={<SoundOutlined />}
                  color="blue"
                  style={{ whiteSpace: "normal", height: "auto" }}
                >
                  <Text strong className="mr-2">
                    File:
                  </Text>
                  <Text style={{ wordBreak: "break-word" }}>
                    {fileInfo.name}
                  </Text>
                </Tag>
                <Tag icon={<ClockCircleOutlined />} color="cyan">
                  <Text strong className="mr-2">
                    Duration:
                  </Text>
                  <Text>{formatDuration(fileInfo.duration)}</Text>
                </Tag>
              </div>
            </div>
          )}
          <div
            className={`mb-3 transition-opacity duration-300 ease-in-out ${
              showAudio ? "opacity-100" : "opacity-0"
            }`}
          >
            <audio controls src={audioUrl} className="w-full" />
          </div>
          <div className="flex flex-col items-start gap-3 bg-orange-50 p-4 rounded-lg">
            {!showConfirm ? (
              <>
                <Text type="warning" strong>
                  Not sure about this file?
                </Text>
                <Button
                  type="primary"
                  ghost
                  icon={<UploadOutlined className="me-2" />}
                  onClick={handleUploadNewClick}
                >
                  Upload New Audio
                </Button>
              </>
            ) : (
              <>
                <Text type="warning" strong>
                  Are you sure you want to replace the current audio file?
                </Text>
                <div className="flex gap-2">
                  <Button type="primary" onClick={resetState}>
                    Yes
                  </Button>
                  <Button
                    type="primary"
                    ghost
                    onClick={() => setShowConfirm(false)}
                  >
                    No
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
