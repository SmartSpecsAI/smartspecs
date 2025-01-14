"use client";
import { useState, useEffect, useRef } from "react";
import {
  Card,
  Button,
  Typography,
  Space,
  Skeleton,
  Tag,
  Row,
  Col,
  message,
} from "antd";
import {
  EditOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useParams } from "next/navigation";
import { useRequirementsData } from "@/smartspecs/lib/presentation";
import { Requirement } from "@/smartspecs/lib/domain";

const { Title, Paragraph } = Typography;

export function RequirementDetailView() {
  const params = useParams();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const { getRequirementAnalysis, getRequirementById, isLoading, error } =
    useRequirementsData();
  const [requirement, setRequirement] = useState<Requirement | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const fetchRequirement = async () => {
      if (params.slug) {
        const data = await getRequirementById(params.slug as string);
        setRequirement(data);
      }
    };
    fetchRequirement();
  }, [params.slug]);

  const handleEditToggle = () => {
    if (isEditMode) {
      message.success("Changes saved successfully");
    }
    setIsEditMode(!isEditMode);
  };

  const handleAudioPlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      const handleEnded = () => setIsPlaying(false);
      audioElement.addEventListener("ended", handleEnded);
      return () => {
        audioElement.removeEventListener("ended", handleEnded);
      };
    }
  }, []);

  useEffect(() => {
    if (!requirement?.transcription) return;
    getRequirementAnalysis(requirement?.transcription);
  }, [requirement]);

  const getStatusColor = (status: string) => {
    const statusMap: { [key: string]: string } = {
      in_progress: "processing",
      completed: "success",
      pending: "warning",
      blocked: "error",
    };
    return statusMap[status.toLowerCase()] || "default";
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <Card className="shadow-sm">
          <Skeleton active paragraph={{ rows: 4 }} />
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Card className="shadow-sm bg-red-50">
          <Title level={4} type="danger">
            Error
          </Title>
          <Paragraph type="danger">{error}</Paragraph>
        </Card>
      </div>
    );
  }

  if (!requirement) {
    return (
      <div className="p-4">
        <Card className="shadow-sm bg-gray-50">
          <Title level={4}>Requirement not found</Title>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-1">
      <Card
        className="card shadow-sm hover:shadow-md transition-shadow duration-300"
        title={
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={3} style={{ margin: 0 }}>
                {requirement.title}
              </Title>
            </Col>
            <Col>
              <Button
                type={isEditMode ? "primary" : "default"}
                icon={isEditMode ? <SaveOutlined /> : <EditOutlined />}
                onClick={handleEditToggle}
                className="hover:scale-105 transition-transform duration-200"
              >
                {isEditMode ? "Save Changes" : "Edit"}
              </Button>
            </Col>
          </Row>
        }
      >
        <Row gutter={[24, 24]}>
          <Col className="!flex flex-col gap-2" xs={24} lg={16}>
            <Card className="card bg-gray-50 border">
              <Title level={5} className="text-gray-700">
                Description
              </Title>
              <Paragraph
                editable={isEditMode}
                className="bg-white p-3 rounded border"
              >
                {requirement.description}
              </Paragraph>
            </Card>

            {requirement.transcription && (
              <Card className="card bg-gray-50 border">
                <Title level={5} className="text-gray-700">
                  Transcription
                </Title>
                <Paragraph className="bg-white p-4 rounded border text-base leading-relaxed max-h-[250px] overflow-y-auto">
                  {requirement.transcription ?? ""}
                  {requirement.transcription ?? ""}
                  {requirement.transcription ?? ""}
                </Paragraph>
              </Card>
            )}
          </Col>

          <Col xs={24} lg={8}>
            <Card className="card bg-gray-50 border">
              <Space direction="vertical" className="w-full" size="large">
                <div>
                  <Title level={5} className="text-gray-700">
                    Client Representative
                  </Title>
                  <Paragraph
                    editable={isEditMode}
                    className="bg-white p-2 rounded border m-0"
                  >
                    {requirement.clientRepName}
                  </Paragraph>
                </div>
                <div>
                  <Title level={5} className="text-gray-700">
                    Status
                  </Title>
                  <Tag
                    color={getStatusColor(requirement.status)}
                    className="text-lg px-4 py-1"
                  >
                    {requirement.status.replace("_", " ").toUpperCase()}
                  </Tag>
                </div>

                <div>
                  <Title level={5} className="text-gray-700">
                    Audio Recording
                  </Title>
                  <audio
                    controls
                    src={requirement.audioUrl}
                    className="w-full"
                  />
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
