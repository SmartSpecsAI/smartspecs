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
  List,
  Input,
} from "antd";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import { useParams } from "next/navigation";
import { useRequirementsData } from "@/smartspecs/lib/presentation";
import { Requirement, RequirementItem } from "@/smartspecs/lib/domain";

const { Title, Paragraph } = Typography;

export function RequirementDetailView() {
  const params = useParams();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const { getRequirementAnalysis, getRequirementById, isLoading, error } =
    useRequirementsData();
  const [requirement, setRequirement] = useState<Requirement | null>(null);
  const [editedItems, setEditedItems] = useState<RequirementItem[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const fetchRequirement = async () => {
      if (params.slug) {
        const data = await getRequirementById(params.slug as string);
        setRequirement(data);
        // setEditedItems(data?.items || []);
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

  const handleItemChange = (index: number, field: string, value: string) => {
    const newItems = [...editedItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setEditedItems(newItems);
  };

  const handleConfirmItems = () => {
    // setRequirement((prev) => {
    //   if (!prev) return null;
    //   const updatedItems = editedItems.map((item, index) => ({
    //     ...prev.items[index],
    //     ...item,
    //   }));
    //   return { ...prev, items: updatedItems };
    // });
    message.success("Items confirmed successfully");
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
            <Card className="card bg-gray-50 border !p-0">
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
        <Card className="card bg-gray-50 border mt-2">
          <Title level={5} className="text-gray-700">
            Requirement Items
          </Title>
          <List
            dataSource={requirement.items}
            renderItem={(item, index) => (
              <List.Item>
                <Card className="w-full bg-gray-50 border p-2">
                  <Space direction="vertical" size="small" className="w-full">
                    <div>
                      <Title level={5} className="text-gray-700 m-0">
                        {item.name}
                      </Title>
                      <Paragraph className="m-0 text-sm text-gray-500">
                        {item.short_resume}
                      </Paragraph>
                    </div>
                    <div>
                      <Title level={5} className="text-gray-700 m-0">
                        Long Description
                      </Title>
                      {isEditMode ? (
                        <Input.TextArea
                          value={item.details}
                          onChange={(e) =>
                            handleItemChange(index, "details", e.target.value)
                          }
                          className="bg-white p-2 rounded border"
                        />
                      ) : (
                        <Paragraph className="m-0">{item.details}</Paragraph>
                      )}
                    </div>
                    <div>
                      <Title level={5} className="text-gray-700 m-0">
                        Type, Estimation Time & Priority
                      </Title>
                      <Space className="mt-2">
                        <Tag color="blue" className="m-0">
                          {item.type}
                        </Tag>
                        <Tag color="green" className="m-0">
                          {item.estimated_time}
                        </Tag>
                        <Tag color="red" className="m-0">
                          {item.priority}
                        </Tag>
                      </Space>
                    </div>
                  </Space>
                </Card>
              </List.Item>
            )}
          />
        </Card>
      </Card>
    </div>
  );
}
