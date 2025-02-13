"use client";
import { Card, Button, Typography, Space, Skeleton, Tag, Row, Col, List, Input } from "antd";
import parse from "html-react-parser";
import { CheckOutlined, EditOutlined, SaveOutlined } from "@ant-design/icons";
import { useRequirementDetail } from "../../hooks/useRequirementDetail";
import { StatusTag } from '../components/common/StatusTag';
import { DetailCard } from "../components/common/DetailCard";
import { StandardButton } from "../components/common/StandardButton";
import { IconButton } from "../components/common/IconButton";
const { Title, Paragraph } = Typography;

export function RequirementDetailView() {
  const {
    isEditMode,
    requirement,
    editedItems,
    editedDescription,
    setEditedDescription,
    isLoading,
    error,
    handleEditToggle,
    handleItemChange,
    handleActionItemChange,
    handleApprove,
    handleReject,
  } = useRequirementDetail();

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
              <Space className="mr-4">
                <IconButton
                  type={isEditMode ? "primary" : "default"}
                  icon={isEditMode ? <SaveOutlined /> : <EditOutlined />}
                  onClick={handleEditToggle}
                  label={isEditMode ? "Save Changes" : "Edit"}
                />
                {requirement.status === "approved" ? (
                  <StandardButton
                    buttonVariant="primary"
                    onClick={handleReject}
                    danger
                  >
                    Reject
                  </StandardButton>
                ) : requirement.status === "rejected" ? (
                  <StandardButton
                    buttonVariant="primary" 
                    onClick={handleApprove}
                  >
                    Approve
                  </StandardButton>
                ) : (
                  <>
                    <StandardButton
                      buttonVariant="primary"
                      onClick={handleApprove}
                    >
                      Approve
                    </StandardButton>
                    <StandardButton
                      buttonVariant="primary"
                      onClick={handleReject}
                      danger
                    >
                      Reject
                    </StandardButton>
                  </>
                )}
              </Space>
            </Col>
          </Row>
        }
      >
        <Row gutter={[24, 24]}>
          <Col className="!flex flex-col gap-2" xs={24} lg={16}>
            <DetailCard title="Description">
              {isEditMode ? (
                <Input.TextArea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="bg-white p-3 rounded border"
                />
              ) : (
                <Paragraph className="bg-white p-3 rounded border">
                  {requirement.description}
                </Paragraph>
              )}
            </DetailCard>

            {requirement.transcription && (
              <DetailCard title="Transcription">
                <Paragraph className="bg-white p-4 rounded border text-base leading-relaxed max-h-[250px] overflow-y-auto">
                  {parse(requirement.transcription ?? "")}
                </Paragraph>
              </DetailCard>
            )}
          </Col>
          <Col xs={24} lg={8}>
            <DetailCard title="Client Representative">
              <Space direction="vertical" className="w-full" size="large">
                <div>
                  <Paragraph className="bg-white p-2 rounded border m-0">
                    {requirement.clientRepName}
                  </Paragraph>
                </div>
                <div>
                  <Title level={5} className="text-gray-700">
                    Status
                  </Title>
                  <StatusTag
                    type="status"
                    value={requirement.status}
                    className="text-lg px-4 py-1"
                  />
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
            </DetailCard>
          </Col>
        </Row>
        <DetailCard title="Requirement Items" className="mt-2">
          <List
            dataSource={editedItems}
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
                        Description
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
                        <StatusTag type="itemType" value={item.type} />
                        <StatusTag type="estimatedTime" value={item.estimated_time} />
                        <StatusTag type="priority" value={item.priority} />
                      </Space>
                    </div>
                    <div>
                      <Title level={5} className="text-gray-700 m-0">
                        Action Items
                      </Title>
                      {isEditMode ? (
                        <List
                          dataSource={item.action_items}
                          renderItem={(actionItem, actionIndex) => (
                            <List.Item>
                              <div className="flex w-full gap-3">
                                <CheckOutlined />
                                <Input
                                  value={actionItem}
                                  onChange={(e) =>
                                    handleActionItemChange(
                                      index,
                                      actionIndex,
                                      e.target.value
                                    )
                                  }
                                  contentEditable
                                  className="bg-white p-2 rounded border w-full"
                                />
                              </div>
                            </List.Item>
                          )}
                        />
                      ) : (
                        <List
                          dataSource={item.action_items}
                          renderItem={(actionItem) => (
                            <List.Item>
                              <Space>
                                <CheckOutlined />
                                {actionItem}
                              </Space>
                            </List.Item>
                          )}
                        />
                      )}
                    </div>
                  </Space>
                </Card>
              </List.Item>
            )}
          />
        </DetailCard>
      </Card>
    </div>
  );
}
