"use client";
import React, { useEffect } from "react";
import { Layout, Menu } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import SmartSpecsIsotype from "@/smartspecs/assets/images/brand/smartspecs-isotype.svg";
import SmartSpecsIsotypeDark from "@/smartspecs/assets/images/brand/smartspecs-isotype-dark.svg";
import Image from "next/image";
import useTheme from "../../hooks/useTheme";

const { Sider } = Layout;

interface AppSiderProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  selectedKeys: string[];
  menuItems: any[];
}

export const AppSider: React.FC<AppSiderProps> = ({ collapsed, setCollapsed, selectedKeys, menuItems }) => {
  const { theme } = useTheme();

  useEffect(() => {
    console.log(theme);
  }, [theme]);

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      className={`bg-background p-4 transition-all duration-300 ${collapsed ? 'w-24' : 'w-[300px] shadow-lg border-r border-primary'}`}
      style={{ marginTop: '64px', position: 'fixed', height: 'calc(100vh - 64px)' }}
    >
      <div className="flex items-center justify-between p-4 border-b border-primary mb-2 ">
        <div className="flex items-center">
          {!collapsed &&
            <div className="flex items-center">
              <Image 
                src={theme === "dark" ? SmartSpecsIsotypeDark : SmartSpecsIsotype}
                alt="Logo" 
                className="w-6 h-6 mr-1" 
              />
              <span className="font-semibold text-sm text-primary">SmartSpecs</span>
            </div>
          }
        </div>
        <div onClick={toggle} className="cursor-pointer">
          {collapsed ? <MenuUnfoldOutlined className="text-primary" /> : <MenuFoldOutlined className="text-primary" />}
        </div>
      </div>

      <Menu
  mode="inline"
  selectedKeys={selectedKeys}
  items={menuItems}
  theme={theme === "dark" ? "dark" : "light"}
/>
    </Sider>
  );
};