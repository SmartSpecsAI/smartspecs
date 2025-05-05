"use client";
import { Modal, Form, Upload, Steps } from "antd";
import { Requirement } from "@/smartspecs/lib/domain";
import {
  useFilesData,
  useProjectsData,
  useRequirementsData,
} from "@/smartspecs/lib/presentation";
import { DetailsStep, UploadStep } from "./steps";
import { useRequirementModal } from "@/smartspecs/lib/presentation/hooks/useRequirementModal";
import { StandardButton } from "@/smartspecs/lib/presentation/components/common/StandardButton";

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
      <StandardButton
        key="cancel"
        buttonVariant="cancel"
        onClick={handleCancel}
      >
        Cancel
      </StandardButton>,
      !initialData && step !== "upload" && (
        <StandardButton
          key="back"
          buttonVariant="secondary"
          onClick={handleBack}
        >
          Back
        </StandardButton>
      ),
      !initialData && step === "upload" ? (
        <StandardButton
          key="continue"
          buttonVariant="primary"
          onClick={handleContinue}
          isLoading={loading}
        >
          {loading ? "Analyzing" : "Continue"}
        </StandardButton>
      ) : (
        step === "details" && (
          <StandardButton
            key="submit"
            buttonVariant="primary"
            isLoading={loading}
            onClick={handleSubmit}
          >
            Submit
          </StandardButton>
        )
      ),
    ].filter(Boolean);

  return (
    <>
      <StandardButton buttonVariant="primary" onClick={handleOpen} className="bg-primary text-white dark:text-background">
        {triggerButtonText}
      </StandardButton>
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
