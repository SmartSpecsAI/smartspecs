"use client";
import { useState, useEffect } from "react";
import { Modal, Form, Upload, Button, Steps } from "antd";
import { Requirement } from "@/smartspecs/domain";
import { useFilesData, useProjectsData } from "@/smartspecs/presentation";
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
        title: currentStep === "upload" ? "Upload Audio" : "Audio Uploaded",
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
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState<"upload" | "details">(
    initialData ? "details" : "upload"
  );
  const { files, setFiles, uploadFile } = useFilesData();
  const { selectedProject } = useProjectsData();

  const file = files[0];

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
      onSubmit(values, file || undefined);
      form.resetFields();
      setFiles([]);
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
    setFiles([]);
    setStep("upload");
    form.resetFields();
  };

  const handleOpen = () => setIsModalOpen(true);

  const handleContinue = () => {
    if (!file) {
      console.error("Please upload an audio file");
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
        setFiles([uploadedFile]);
      } catch (error) {
        console.error(`Failed to upload ${info.file.name}`);
      }
    } else if (info.file.status === "error") {
      console.error(`${info.file.name} upload failed`);
    }
  };

  const uploadProps = {
    beforeUpload: (file: File) => {
      const isAudio = file.type.startsWith("audio/");
      if (!isAudio) {
        console.error("You can only upload audio files!");
        return Upload.LIST_IGNORE;
      }
      return true;
    },
    onChange: handleFileChange,
    maxCount: 1,
    file: file,
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
        closable={false}
        onCancel={handleCancel}
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
          <DetailsStep form={form} project={selectedProject} />
        )}
      </Modal>
    </>
  );
};
