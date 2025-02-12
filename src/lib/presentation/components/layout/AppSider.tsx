"use client";
import React from "react";
import { Layout, Menu } from "antd";
import {
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useAppSiderLogic } from "../../hooks/useAppSiderLogic";
import SmartSpecsIsotype from "@/smartspecs/assets/images/brand/smartspecs-isotype.svg";
import Image from "next/image";
const { Sider } = Layout;

export const AppSider: React.FC = () => {
  const { collapsed, setCollapsed, isMobile, menuItems, selectedKeys } = useAppSiderLogic();

  return (
    <Sider
      width={260}
      // collapsible
      collapsedWidth={isMobile ? 0 : 80}
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      className="bg-white overflow-hidden"
      // theme="light"
      breakpoint="lg"
      style={{
        boxShadow: "rgba(208, 208, 208, 0.7) 0px 0px 7px 0px",
        transition: "all 0.2s ease-in-out",
      }}
    >
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center">
          {!collapsed &&
            <div className="flex items-center">
              <Image src={SmartSpecsIsotype} alt="Logo" className="w-6 h-6 mr-2" />
              <span className="font-semibold text-lg text-primary">SmartSpecs</span>
            </div>
        }
        </div>

        <div
          className="cursor-pointer p-2 rounded-md hover:bg-gray-100 transition"
          onClick={() => setCollapsed(!collapsed)}
        >
          {!collapsed ? <LeftOutlined className="text-primary" /> : <RightOutlined className="text-primary" />}
        </div>
      </div>

      <Menu
        mode="inline"
        className="border-end-0"
        selectedKeys={selectedKeys}
        items={menuItems}
      />
    </Sider>
  );
};