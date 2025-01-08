"use client";
import { useState, useEffect } from "react";
import { Modal, Form, Upload, Button, message, Steps } from "antd";
import { Requirement } from "@/smartspecs/domain";
import { useFilesData } from "@/smartspecs/presentation";
import { DetailsStep, UploadStep } from "./steps";

interface RequirementModalProps {
  triggerButtonText?: string;
  onSubmit: (requirement: Partial<Requirement>, audioFile?: File) => void;
  initialData?: Requirement;
  title?: string;
}

const StepsIndicator = ({
  currentStep,
}: {
  currentStep: "upload" | "details";
}) => (
  <Steps
    current={currentStep === "upload" ? 0 : 1}
    items={[
      {
        title: "Upload Audio",
      },
      {
        title: "Add Details",
      },
    ]}
    style={{ marginBottom: 24 }}
  />
);

export const RequirementModal: React.FC<RequirementModalProps> = ({
  triggerButtonText = "Add Requirement",
  onSubmit,
  initialData,
  title = initialData ? "Edit Requirement" : "Create Requirement",
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [step, setStep] = useState<"upload" | "details">(
    initialData ? "details" : "upload"
  );
  const { uploadFile } = useFilesData();

  useEffect(() => {
    if (isModalOpen && initialData) {
      form.setFieldsValue({
        title: initialData.title,
        description: initialData.description,
        clientRepName: initialData.clientRepName,
      });
    }
  }, [isModalOpen, initialData, form]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      onSubmit(values, audioFile || undefined);
      form.resetFields();
      setAudioFile(null);
      setStep("upload");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Validation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setAudioFile(null);
    setStep("upload");
    form.resetFields();
  };

  const handleOpen = () => setIsModalOpen(true);

  const handleContinue = () => {
    if (!audioFile) {
      message.error("Please upload an audio file");
      return;
    }
    setStep("details");
  };

  const handleBack = () => {
    setStep("upload");
  };

  const handleFileChange = async (info: any) => {
    if (info.file.status === "done") {
      try {
        const uploadedFile = info.file.originFileObj;
        await uploadFile(uploadedFile, `requirements/audios/${info.file.uid}`);
        setAudioFile(uploadedFile);
        messageApi.success(`${info.file.name} uploaded successfully`);
      } catch (error) {
        messageApi.error(`Failed to upload ${info.file.name}`);
      }
    } else if (info.file.status === "error") {
      messageApi.error(`${info.file.name} upload failed`);
    }
  };

  const uploadProps = {
    beforeUpload: (file: File) => {
      const isAudio = file.type.startsWith("audio/");
      if (!isAudio) {
        messageApi.error("You can only upload audio files!");
        return Upload.LIST_IGNORE;
      }
      return true;
    },
    onChange: handleFileChange,
    maxCount: 1,
    file: audioFile,
    accept: "audio/*",
  };

  return (
    <>
      <Button type="primary" onClick={handleOpen}>
        {triggerButtonText}
      </Button>
      <Modal
        title={title}
        open={isModalOpen}
        onCancel={handleCancel}
        closeIcon={null}
        footer={[
          <Button key="cancel" style={{ float: "left" }} onClick={handleCancel}>
            Cancel
          </Button>,
          !initialData && step === "details" && (
            <Button key="back" onClick={handleBack}>
              Back
            </Button>
          ),
          !initialData && step === "upload" ? (
            <Button key="continue" type="primary" onClick={handleContinue}>
              Continue
            </Button>
          ) : (
            <Button
              key="submit"
              type="primary"
              loading={loading}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          ),
        ].filter(Boolean)}
      >
        {!initialData && <StepsIndicator currentStep={step} />}
        {!initialData && step === "upload" ? (
          <UploadStep uploadProps={uploadProps} />
        ) : (
          <DetailsStep form={form} />
        )}
      </Modal>
    </>
  );
};
