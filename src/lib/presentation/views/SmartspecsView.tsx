"use client";
import { Card, Row, Col, Tag, Button, Skeleton, Empty } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { Dropdown, DropdownItem, RequirementModal } from "@/smartspecs/lib/presentation";
import { useRouter } from "next/navigation";
import { colorByStatus, stringToStatus } from "../../domain";
import { useSmartspecsData } from "../../hooks/useSmartspecsData";
import { StatusTag } from "../components/common/StatusTag";

export function SmartspecsView() {
  const router = useRouter();
  const {
    projects,
    selectedProject,
    setSelectedProject,
    projectsLoading,
    projectsError,
    requirements,
    requirementsLoading,
    requirementsError,
    handleRefresh,
  } = useSmartspecsData();

  const items = projects.map((project) => ({
    label: project.name ?? "",
    value: project.id,
  }));

  const selectedProjectToDropdown = selectedProject
    ? {
        value: selectedProject.id,
        label: selectedProject.name ?? "",
      }
    : null;

  const handleMenuClick = (item: DropdownItem) => {
    const project = projects.find((p) => p.id === item.value);
    if (project) {
      setSelectedProject(project);
    }
  };

  if (projects.length == 0 || projectsLoading) {
    return (
      <div>
        <div className="flex justify-between w-100 mb-3">
          <Skeleton.Input style={{ width: 200 }} active />
          <Skeleton.Button active />
        </div>
      </div>
    );
  }

  if (projectsError) {
    return (
      <div className="text-error">
        Error loading projects: {projectsError}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between w-100 mb-3 text-text">
        <div className="flex">
          <Dropdown
            items={items}
            onSelect={handleMenuClick}
            selectedItem={selectedProjectToDropdown}
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            loading={projectsLoading || requirementsLoading}
            shape="circle"
            className="ml-2 hover:shadow-md transition-shadow duration-200 border border-gray-200"
            size="middle"
          />
        </div>
        <RequirementModal />
      </div>

      <Row gutter={[16, 16]}>
        {requirementsLoading ? (
          [...Array(6)].map((_, index) => (
            <Col xs={24} md={12} lg={8} key={index}>
              <Card>
                <Skeleton active>
                  <Skeleton.Input style={{ width: 200 }} />
                  <Skeleton.Input style={{ width: 300 }} />
                </Skeleton>
              </Card>
            </Col>
          ))
        ) : requirementsError ? (
          <div className="text-error">
            Error loading requirements: {requirementsError}
          </div>
        ) : requirements.length === 0 ? (
          <Col span={24}>
            <Empty description="No requirements found">
              <RequirementModal triggerButtonText="Add Requirement"></RequirementModal>
            </Empty>
          </Col>
        ) : (
          requirements.map((requirement) => {
            return (
              <Col xs={24} md={12} lg={8} key={requirement.id}>
                <Card
                  title={requirement.title}
                  className="card cursor-pointer transition-shadow duration-300 hover:shadow-outline"
                  onClick={() => router.push(`/smartspecs/${requirement.id}`)}
                >
                  <p>{requirement.description}</p>
                  <p>
                    Created: {requirement.createdAt.toDate().toLocaleString()}
                    <br />
                    Updated: {requirement.updatedAt.toDate().toLocaleString()}
                    <br />
                    <b>Client Rep:</b> {requirement.clientRepName}
                  </p>
                  <StatusTag
                    type="status"
                    value={requirement.status}
                    className="rounded-lg"
                  />
                </Card>
              </Col>
            );
          })
        )}
      </Row>
    </div>
  );
}
