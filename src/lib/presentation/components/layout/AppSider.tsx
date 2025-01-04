"use client";
import React, { useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import type { MenuProps } from "antd";
import {
  FileDoneOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

export const AppSider: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 992); // lg breakpoint is 992px
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const menuItems: MenuProps["items"] = [
    {
      key: "smartspecs",
      icon: <FileDoneOutlined />,
      label: "SmartSpecs",
      //   children: [
      //     {
      //       key: "/manage/worklog",
      //       label: "Log Time",
      //     },
      //     {
      //       key: "/manage/leave/my",
      //       label: "Take Leave",
      //     },
      //   ],
    },
  ];

  return (
    <Sider
      width={260}
      collapsible
      collapsedWidth={isMobile && collapsed ? 0 : 80}
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      className="bg-white overflow-hidden"
      theme="light"
      breakpoint="lg"
      style={{
        boxShadow: "rgba(208, 208, 208, 0.7) 0px 0px 7px 0px",
      }}
      trigger={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
    >
      <div className="wcp-silder-menu-container">
        <Menu
          mode="inline"
          className="border-end-0"
          defaultSelectedKeys={["smartspecs"]}
          items={menuItems}
        />
      </div>
    </Sider>
  );
};
