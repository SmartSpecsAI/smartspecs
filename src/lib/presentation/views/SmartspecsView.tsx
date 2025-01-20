"use client";
import { useEffect } from "react";
import { Card, Row, Col, Tag, Button, Skeleton, Empty } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import {
  Dropdown,
  DropdownItem,
  RequirementModal,
  useProjectsData,
  useRequirementsData,
  useFilesData,
} from "@/smartspecs/lib/presentation";
import { useRouter } from "next/navigation";
import { colorByStatus, stringToStatus } from "../../domain";

export function SmartspecsView() {
  const router = useRouter();
  const {
    projects,
    selectedProject,
    setSelectedProject,
    isLoading: projectsLoading,
    error: projectsError,
    refetch: refetchProjects,
  } = useProjectsData();

  const {
    requirements,
    isLoading: requirementsLoading,
    error: requirementsError,
    refetch: refetchRequirements,
  } = useRequirementsData();

  const { file } = useFilesData();

  const handleRefresh = async () => {
    await Promise.all([refetchProjects(), refetchRequirements()]);
  };

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

  useEffect(() => {
    if (projects[0]) {
      setSelectedProject(projects[0]);
    }
  }, [projects]);

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
      <div className="text-red-500">
        Error loading projects: {projectsError}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between w-100 mb-3">
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
          <div className="text-red-500">
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
            const status = stringToStatus(requirement.status);
            return (
              <Col xs={24} md={12} lg={8} key={requirement.id}>
                <Card
                  title={requirement.title}
                  className="card cursor-pointer transition-shadow duration-300 hover:shadow-outline"
                  onClick={() => router.push(`/smartspecs/${requirement.id}`)}
                >
                  <p>{requirement.description}</p>
                  <p className="text-gray-700">
                    Created: {requirement.createdAt.toDate().toLocaleString()}
                    <br />
                    Updated: {requirement.updatedAt.toDate().toLocaleString()}
                    <br />
                    <b>Client Rep:</b> {requirement.clientRepName}
                  </p>
                  <Tag
                    color={status ? colorByStatus(status) : "default"}
                    className="rounded-lg"
                  >
                    {requirement.status.replace("_", " ").toUpperCase()}
                  </Tag>
                </Card>
              </Col>
            );
          })
        )}
      </Row>
    </div>
  );
}
