"use client";
import { Card, Button, Typography, Space, Skeleton, Tag, Row, Col, List, Input } from "antd";
import parse from "html-react-parser";
import { CheckOutlined, EditOutlined, SaveOutlined } from "@ant-design/icons";
import { colorByStatus } from "@/smartspecs/lib/domain";
import { useRequirementDetail } from "../../hooks/useRequirementDetail";
import { RequirementActionButton } from "../components/common/RequirementActionButton";

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
                <RequirementActionButton
                  type={isEditMode ? "primary" : "default"}
                  icon={isEditMode ? <SaveOutlined /> : <EditOutlined />}
                  onClick={handleEditToggle}
                  label={isEditMode ? "Save Changes" : "Edit"}
                />
                {requirement.status === "approved" ? (
                  <RequirementActionButton
                    type="primary"
                    onClick={handleReject}
                    danger
                    label="Reject"
                  />
                ) : requirement.status === "rejected" ? (
                  <RequirementActionButton
                    type="primary"
                    onClick={handleApprove}
                    label="Approve"
                  />
                ) : (
                  <>
                    <RequirementActionButton
                      type="primary"
                      onClick={handleApprove}
                      label="Approve"
                    />
                    <RequirementActionButton
                      type="primary"
                      onClick={handleReject}
                      danger
                      label="Reject"
                    />
                  </>
                )}
              </Space>
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
            </Card>

            {requirement.transcription && (
              <Card className="card bg-gray-50 border">
                <Title level={5} className="text-gray-700">
                  Transcription
                </Title>
                <Paragraph className="bg-white p-4 rounded border text-base leading-relaxed max-h-[250px] overflow-y-auto">
                  {parse(requirement.transcription ?? "")}
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
                  <Paragraph className="bg-white p-2 rounded border m-0">
                    {requirement.clientRepName}
                  </Paragraph>
                </div>
                <div>
                  <Title level={5} className="text-gray-700">
                    Status
                  </Title>
                  <Tag
                    color={colorByStatus(requirement.status)}
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
                        <Tag color="blue" className="m-0">
                          {item.type
                            .replace("_", " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </Tag>
                        <Tag color="green" className="m-0">
                          {item.estimated_time}
                        </Tag>
                        <Tag
                          color={
                            item.priority === "high"
                              ? "red"
                              : item.priority === "medium"
                              ? "orange"
                              : "yellow"
                          }
                          className="m-0"
                        >
                          {item.priority.replace(/\b\w/g, (l) =>
                            l.toUpperCase()
                          )}
                        </Tag>
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
        </Card>
      </Card>
    </div>
  );
}
