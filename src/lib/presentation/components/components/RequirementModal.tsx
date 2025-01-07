"use client";
import { useState, useEffect } from "react";
import { Modal, Form, Input, Upload, Button, message, Tooltip } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Requirement } from "@/smartspecs/domain";

interface RequirementModalProps {
  triggerButtonText?: string;
  onSubmit: (requirement: Partial<Requirement>, audioFile?: File) => void;
  initialData?: Requirement;
  title?: string;
}

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

  useEffect(() => {
    if (isModalOpen && initialData) {
      form.setFieldsValue({
        title: initialData.title,
        // description: initialData.description,
        clientRepName: initialData.clientRepName,
      });
    }
  }, [isModalOpen, initialData, form]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      if (!initialData && !audioFile) {
        message.error("Please upload an audio file");
        return;
      }

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

  const handleFileChange = (info: any) => {
    if (info.file.status === "done") {
      setAudioFile(info.file.originFileObj);
      setStep("details");
      messageApi.success(`${info.file.name} uploaded successfully`);
    } else if (info.file.status === "error") {
      messageApi.error(`${info.file.name} upload failed`);
    }
  };

  const uploadProps = {
    beforeUpload: (file: File) => {
      const isAudio = file.type.startsWith("audio/");
      console.log("isAudio:::", isAudio);
      if (!isAudio) {
        messageApi.error("You can only upload audio files!");
        return Upload.LIST_IGNORE;
      }
      return true;
    },
    onChange: handleFileChange,
    maxCount: 1,
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
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          step === "upload" && !initialData ? null : (
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
        {!initialData && step === "upload" ? (
          <Upload.Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <UploadOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag audio file to upload
            </p>
            <p className="ant-upload-hint">
              Support for single audio file upload
            </p>
          </Upload.Dragger>
        ) : (
          <Form form={form} layout="vertical">
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: "Please input the title!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[
                { required: true, message: "Please input the description!" },
              ]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item
              name="clientRepName"
              label="Client Representative"
              rules={[
                {
                  required: true,
                  message: "Please input the client representative name!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </>
  );
};
