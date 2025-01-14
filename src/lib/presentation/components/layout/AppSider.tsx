"use client";
import React, { useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import type { MenuProps } from "antd";
import {
  FileDoneOutlined,
  HeartFilled,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";

const { Sider } = Layout;

export const AppSider: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

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
      onClick: () => router.push("/smartspecs"),
    },
    {
      key: "menuitem1",
      icon: <HeartFilled />,
      label: "Menu Item 1",
      onClick: () => router.push("/menuitem1"),
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
          selectedKeys={[pathname.split("/")[1]]}
          items={menuItems}
        />
      </div>
    </Sider>
  );
};
