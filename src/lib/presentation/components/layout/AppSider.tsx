"use client";
import React from "react";
import { Layout, Menu } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import SmartSpecsIsotype from "@/smartspecs/assets/images/brand/smartspecs-isotype.svg";
import Image from "next/image";

const { Sider } = Layout;

interface AppSiderProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  selectedKeys: string[];
  menuItems: any[];
}

export const AppSider: React.FC<AppSiderProps> = ({ collapsed, setCollapsed, selectedKeys, menuItems }) => {

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      className={`bg-white text-black p-4 transition-all duration-300 ${collapsed ? 'w-24' : 'w-[300px] shadow-lg border-l-2 border-gray-300'}`}
      style={{ marginTop: '64px', position: 'fixed', height: 'calc(100vh - 64px)' }}
    >
      <div className="flex items-center justify-between p-4 border-b border-primary mb-2 ">
        <div className="flex items-center">
          {!collapsed &&
            <div className="flex items-center">
              <Image src={SmartSpecsIsotype} alt="Logo" className="w-6 h-6 mr-1" />
              <span className="font-semibold text-sm text-primary">SmartSpecs</span>
            </div>
          }
        </div>
        <div onClick={toggle} className="cursor-pointer">
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
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