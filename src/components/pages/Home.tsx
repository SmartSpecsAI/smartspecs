"use client";
import { useState, useEffect } from "react";
import { Card, Row, Col, Tag, Button, Space, Tooltip, MenuProps } from "antd";
import {
  FilePdfOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Dropdown, DropdownItem } from "@/smartspecs/components";

interface Requirement {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  status: "in_progress" | "approved" | "rejected";
  clientRepName: string;
}

const items: DropdownItem[] = [
  {
    value: "1",
    text: "1st menu item",
  },
  {
    value: "2",
    text: "2nd menu item",
  },
  {
    value: "3",
    text: "3rd menu item",
  },
  {
    value: "4",
    text: "4th menu item",
  },
];

export function Home() {
  const [selectedProject, setSelectedProject] = useState<DropdownItem | null>(
    null
  );
  const [projects, setProjects] = useState<DropdownItem[]>([]);
  const [requirements, setRequirements] = useState<Requirement[]>([]);

  useEffect(() => {
    setProjects(items);
    setSelectedProject(items[0]);
  }, []);

  useEffect(() => {
    if (selectedProject) {
      // TODO: Fetch requirements for selected project from API
      setRequirements([
        {
          id: "1",
          title: "Sample Requirement 1",
          createdAt: new Date(),
          updatedAt: new Date(),
          status: "in_progress",
          clientRepName: "John Doe",
        },
        {
          id: "2",
          title: "Sample Requirement 2",
          createdAt: new Date(),
          updatedAt: new Date(),
          status: "approved",
          clientRepName: "Jane Smith",
        },
        {
          id: "3",
          title: "Sample Requirement 3",
          createdAt: new Date(),
          updatedAt: new Date(),
          status: "rejected",
          clientRepName: "Bob Wilson",
        },
        {
          id: "4",
          title: "Sample Requirement 4",
          createdAt: new Date(),
          updatedAt: new Date(),
          status: "in_progress",
          clientRepName: "Alice Brown",
        },
        {
          id: "5",
          title: "Sample Requirement 5",
          createdAt: new Date(),
          updatedAt: new Date(),
          status: "approved",
          clientRepName: "Charlie Davis",
        },
        {
          id: "6",
          title: "Sample Requirement 6",
          createdAt: new Date(),
          updatedAt: new Date(),
          status: "in_progress",
          clientRepName: "Eve Martin",
        },
        {
          id: "7",
          title: "Sample Requirement 7",
          createdAt: new Date(),
          updatedAt: new Date(),
          status: "rejected",
          clientRepName: "Frank Johnson",
        },
        {
          id: "8",
          title: "Sample Requirement 8",
          createdAt: new Date(),
          updatedAt: new Date(),
          status: "approved",
          clientRepName: "Grace Lee",
        },
        {
          id: "9",
          title: "Sample Requirement 9",
          createdAt: new Date(),
          updatedAt: new Date(),
          status: "in_progress",
          clientRepName: "Henry Taylor",
        },
        {
          id: "10",
          title: "Sample Requirement 10",
          createdAt: new Date(),
          updatedAt: new Date(),
          status: "approved",
          clientRepName: "Ivy Clark",
        },
      ]);
    }
  }, [selectedProject]);

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

  const handleOpenPDF = (id: string) => {
    // TODO: Implement PDF opening logic
  };

  const handleEdit = (id: string) => {
    // TODO: Implement edit logic
  };

  const handleDelete = (id: string) => {
    // TODO: Implement delete logic
  };

  const handleMenuClick = (item: DropdownItem) => {
    setSelectedProject(item);
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <Dropdown
          items={items}
          onSelect={handleMenuClick}
          selectedItem={selectedProject}
        ></Dropdown>
      </div>

      <Row gutter={[16, 16]}>
        {requirements.map((requirement) => (
          <Col xs={24} md={12} lg={8} key={requirement.id}>
            <Card title={requirement.title} className="card">
              <p className="text-gray-500">
                Created: {requirement.createdAt.toLocaleDateString()}
                <br />
                Updated: {requirement.updatedAt.toLocaleDateString()}
                <br />
                Client Rep: {requirement.clientRepName}
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
        ))}
      </Row>
    </div>
  );
}
