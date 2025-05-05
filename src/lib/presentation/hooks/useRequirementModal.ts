import { useState, useEffect } from "react";
import { Form } from "antd";
import { Requirement } from "@/smartspecs/lib/domain";
import {
  useFilesData,
  useProjectsData,
  useRequirementsData,
} from "@/smartspecs/lib/presentation";

export const useRequirementModal = (initialData?: Requirement) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState<"upload" | "details">(
    initialData ? "details" : "upload"
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
        const requirementData = {
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

  const handleOpen = () => setIsModalOpen(true);
  const handleCancel = () => resetForm();

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
      } catch (error) {
        console.error(`Failed to upload ${info.file.name}`);
      }
    } else if (info.file.status === "error") {
      console.error(`${info.file.name} upload failed`);
    }
  };

  const _analyzeAndBuildRequirement = async (file: File | null) => {
    if (!file || !selectedProject?.id) return;
    const transcriptionResult = await transcriptAudio(file);
    const analysisResult = await getRequirementAnalysis(transcriptionResult);

    form.setFieldsValue({
      title: analysisResult.title,
      description: analysisResult.description,
    });
  };

  return {
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
  };
}; 