"use client";
import { useState, useEffect } from "react";
import { Modal, Form, Upload, Button, Steps } from "antd";
import { Requirement } from "@/smartspecs/domain";
import { useFilesData, useProjectsData } from "@/smartspecs/presentation";
import { DetailsStep, UploadStep } from "./steps";
import { useRequirementsData } from "@/lib/presentation/hooks/RequirementHooks";

interface RequirementModalProps {
  triggerButtonText?: string;

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

  initialData,
  title = initialData ? "Edit Requirement" : "Create Requirement",
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState<"upload" | "details">(
    initialData ? "details" : "upload"
  );

  const { file, setFile, transcriptAudio, transcription, setTranscription } =
    useFilesData();
  const { selectedProject } = useProjectsData();
  const { createRequirement } = useRequirementsData();

  useEffect(() => {
    if (isModalOpen && initialData) {
      form.setFieldsValue({
        title: initialData.title,
        description: initialData.description,
        clientRep: initialData.clientRepName,
      });
    }
  }, [isModalOpen, initialData, form]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      if (file) {
        const transcriptionResult = await transcriptAudio(file);
        console.log("transcriptionResult", transcriptionResult);
        const requirementData = {
          ...values,
          transcription: transcriptionResult,
          projectId: selectedProject?.id,
        };

        await createRequirement(requirementData);

        form.resetFields();
        setFile(null);
        setStep("upload");
        setTranscription("");
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Validation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setFile(null);
    setStep("upload");
    setTranscription("");
    form.resetFields();
  };

  const handleOpen = () => setIsModalOpen(true);

  const handleContinue = async () => {
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
        setFile(uploadedFile);
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
          !initialData && step !== "upload" && (
            <Button key="back" onClick={handleBack}>
              Back
            </Button>
          ),
          !initialData && step === "upload" ? (
            <Button key="continue" type="primary" onClick={handleContinue}>
              Continue
            </Button>
          ) : (
            step === "details" && (
              <Button
                key="submit"
                type="primary"
                loading={loading}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            )
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
