"use client";
import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Tag,
  Button,
  Space,
  Tooltip,
  Skeleton,
  Empty,
} from "antd";
import {
  FilePdfOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  Dropdown,
  DropdownItem,
  RequirementModal,
} from "@/smartspecs/presentation";
import {
  useProjectsData,
  useRequirementsData,
  useFilesData,
} from "@/smartspecs/presentation";

export function Home() {
  const {
    projects,
    selectedProject,
    setSelectedProject,
    isLoading: projectsLoading,
    error: projectsError,
  } = useProjectsData();

  const {
    requirements,
    isLoading: requirementsLoading,
    error: requirementsError,
  } = useRequirementsData();

  const { files } = useFilesData();

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

  const getStatusTagColor = (status: string) => {
    switch (status) {
      case "in_progress":
        return "warning";
      case "approved":
        return "success";
      case "rejected":
        return "error";
      default:
        return "default";
    }
  };

  const handleOpenPDF = async (id: string) => {
    if (!selectedProject) return;
    try {
      const path = `projects/${selectedProject.id}/requirements/${id}/document.pdf`;
      const file = files.find((f) => f.name === path);
      if (file) {
        window.open(URL.createObjectURL(file));
      }
    } catch (error) {
      console.error("Error opening PDF:", error);
    }
  };

  const handleEdit = (id: string) => {
    // TODO: Implement edit logic
  };

  const handleDelete = (id: string) => {
    // TODO: Implement delete logic
  };

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
        <Dropdown
          items={items}
          onSelect={handleMenuClick}
          selectedItem={selectedProjectToDropdown}
        />
        <RequirementModal
          triggerButtonText="Add Requirement"
          onSubmit={() => {}}
        ></RequirementModal>
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
              <RequirementModal
                triggerButtonText="Add Requirement"
                onSubmit={() => {}}
              ></RequirementModal>
            </Empty>
          </Col>
        ) : (
          requirements.map((requirement) => (
            <Col xs={24} md={12} lg={8} key={requirement.id}>
              <Card title={requirement.title} className="card">
                <p>{requirement.description}</p>
                <p className="text-gray-700">
                  Created: {requirement.createdAt.toDate().toLocaleString()}
                  <br />
                  Updated: {requirement.updatedAt.toDate().toLocaleString()}
                  <br />
                  <b>Client Rep:</b> {requirement.clientRepName}
                </p>
                <Tag
                  color={getStatusTagColor(requirement.status)}
                  className="rounded-lg"
                >
                  {requirement.status.replace("_", " ").toUpperCase()}
                </Tag>
                <div className="mt-3">
                  <Space>
                    <Tooltip title="View PDF" arrow={false}>
                      <Button
                        type="default"
                        icon={<FilePdfOutlined />}
                        onClick={() => handleOpenPDF(requirement.id)}
                      />
                    </Tooltip>
                    <Tooltip title="Edit Requirement" arrow={false}>
                      <Button
                        type="default"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(requirement.id)}
                      />
                    </Tooltip>
                    <Tooltip title="Delete Requirement" arrow={false}>
                      <Button
                        type="default"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(requirement.id)}
                      />
                    </Tooltip>
                  </Space>
                </div>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </div>
  );
}
