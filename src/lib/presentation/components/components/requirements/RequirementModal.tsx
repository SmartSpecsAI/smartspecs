"use client";
import { useState, useEffect } from "react";
import { Modal, Form, Upload, Button, Steps } from "antd";
import { Requirement } from "@/smartspecs/lib/domain";
import {
  useFilesData,
  useProjectsData,
  useRequirementsData,
} from "@/smartspecs/lib/presentation";
import { DetailsStep, UploadStep } from "./steps";

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
  const [fileUrl, setFileUrl] = useState("");
  const [step, setStep] = useState<"upload" | "details">(
    initialData ? "details" : "upload"
  );

  const [tempRequirement, setTempRequirement] = useState<Requirement | null>(
    null
  );

  const {
    file,
    setFile,
    setTranscription,
    uploadFile,
    getFileUrl,
    transcriptAudio,
  } = useFilesData();
  const { selectedProject } = useProjectsData();
  const { createRequirement, getRequirementAnalysis } = useRequirementsData();

  useEffect(() => {
    if (isModalOpen && initialData) {
      form.setFieldsValue({
        title: initialData.title,
        description: initialData.description,
        clientRepName: initialData.clientRepName,
      });
    }
  }, [isModalOpen, initialData, form]);

  const resetForm = () => {
    form.resetFields();
    setFile(null);
    setStep("upload");
    setTranscription("");
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      if (file) {
        const transcriptionResult = await transcriptAudio(file);
        console.log("transcriptionResult", transcriptionResult);
        const requirementData = {
          ...tempRequirement,
          ...values,
        };
        await createRequirement(requirementData);
        resetForm();
      }
    } catch (error) {
      console.error("Validation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => resetForm();

  const handleOpen = () => setIsModalOpen(true);

  const handleContinue = async () => {
    if (!file) {
      console.error("Please upload an audio file");
      return;
    }
    setLoading(true);
    try {
      await _analyzeAndBuildRequirement(file);
      setStep("details");
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => setStep("upload");

  const handleFileChange = async (info: any) => {
    if (info.file.status === "done") {
      try {
        const uploadedFile = info.file.originFileObj;
        const filePath = `requirements/audios/${uploadedFile.uid}`;
        setFile(uploadedFile);
        await uploadFile(uploadedFile, filePath);
        const fileURL = await getFileUrl(filePath.replaceAll("/", "%2F"));
        setFileUrl(fileURL);
        console.log("NEW FILE", info);
      } catch (error) {
        console.error(`Failed to upload ${info.file.name}`);
      }
    } else if (info.file.status === "error") {
      console.error(`${info.file.name} upload failed`);
    }
  };

  const _analyzeAndBuildRequirement = async (file: File | null) => {
    if (!file) return;
    const transcriptionResult = await transcriptAudio(file);

    const analysisResult = await getRequirementAnalysis(transcriptionResult);
    console.log("transcriptionResult", transcriptionResult);
    const requirementData = {
      ...analysisResult,
      transcription: transcriptionResult,
      projectId: selectedProject?.id,
      audioUrl: fileUrl,
    };
    form.setFieldsValue({
      title: analysisResult.title,
      description: analysisResult.description,
    });
    setTempRequirement(requirementData);
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
    file,
    accept: "audio/*",
  };

  const renderFooterButtons = () =>
    [
      <Button key="cancel" style={{ float: "left" }} onClick={handleCancel}>
        Cancel
      </Button>,
      !initialData && step !== "upload" && (
        <Button key="back" onClick={handleBack}>
          Back
        </Button>
      ),
      !initialData && step === "upload" ? (
        <Button
          key="continue"
          type="primary"
          onClick={handleContinue}
          loading={loading}
        >
          {loading ? "Analyzing" : "Continue"}
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
    ].filter(Boolean);

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
        footer={renderFooterButtons()}
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
