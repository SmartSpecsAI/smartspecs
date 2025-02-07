"use client";
import React from "react";
import { Layout, Menu } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { useAppSiderLogic } from "../../hooks/useAppSiderLogic";

const { Sider } = Layout;

export const AppSider: React.FC = () => {
  const { collapsed, setCollapsed, isMobile, menuItems, selectedKeys } = useAppSiderLogic();

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
          selectedKeys={selectedKeys}
          items={menuItems}
        />
      </div>
    </Sider>
  );
};
