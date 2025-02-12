"use client";
import { Modal, Form, Upload, Button, Steps } from "antd";
import { Requirement } from "@/smartspecs/lib/domain";
import {
  useFilesData,
  useProjectsData,
  useRequirementsData,
} from "@/smartspecs/lib/presentation";
import { DetailsStep, UploadStep } from "./steps";
import { useRequirementModal } from "@/smartspecs/lib/presentation/hooks/useRequirementModal";

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
  const {
    form,
    loading,
    isModalOpen,
    setIsModalOpen,
    step,
    handleSubmit,
    handleOpen,
    handleCancel,
    handleContinue,
    handleBack,
    handleFileChange,
  } = useRequirementModal(initialData);

  const {
    file,
  } = useFilesData();
  const { selectedProject } = useProjectsData();

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
