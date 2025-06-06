"use client";
import { Upload, Button, Tag, Typography } from "antd";
import {
  UploadOutlined,
  SoundOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useState, useCallback, useEffect } from "react";
import useUploadLogic from "@/smartspecs/lib/presentation/hooks/useUploadLogic";
import { InfoTag } from "../../../common/InfoTag";
import { StandardButton } from "../../../common/StandardButton";
import { IconButton } from "../../../common/IconButton";

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
  const {
    audioUrl,
    showAudio,
    fileInfo,
    showConfirm,
    resetState,
    handleUploadChange,
    setShowConfirm,
  } = useUploadLogic(uploadProps);

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
              <Title level={5} className="mb-2 text-primary">
                Audio File Details
              </Title>
              <div className="flex flex-wrap gap-2">
                <InfoTag
                  icon={<SoundOutlined />}
                  color="blue"
                  label="File"
                  value={fileInfo.name}
                />
                <InfoTag
                  icon={<ClockCircleOutlined />}
                  color="cyan"
                  label="Duration"
                  value={formatDuration(fileInfo.duration)}
                />
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
                <IconButton
                  type="primary"
                  ghost
                  icon={<UploadOutlined />}
                  onClick={handleUploadNewClick}
                  label="Upload New Audio"
                />
              </>
            ) : (
              <>
                <Text type="warning" strong>
                  Are you sure you want to replace the current audio file?
                </Text>
                <div className="flex gap-2">
                  <StandardButton buttonVariant="primary" onClick={resetState}>
                    Yes
                  </StandardButton>
                  <StandardButton
                    buttonVariant="secondary"
                    onClick={() => setShowConfirm(false)}
                  >
                    No
                  </StandardButton>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
