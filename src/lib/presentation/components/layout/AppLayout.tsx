"use client";
import { Layout } from "antd";
import { ReactNode } from "react";
import { AppHeader } from "./AppHeader";
import { AppSider } from "./AppSider";
import { useAppSiderLogic } from "../../hooks/useAppSiderLogic";

interface LayoutProps {
  children: ReactNode;
}
const { Content } = Layout;

export const AppLayout = ({ children }: LayoutProps) => {
  const { collapsed, setCollapsed, menuItems, selectedKeys } = useAppSiderLogic();

  return (
    <Layout className="min-h-screen ">
      <AppHeader />
      <Layout hasSider className="flex h-auto md:overflow-hidden bg-background">
        <AppSider collapsed={collapsed} setCollapsed={setCollapsed} menuItems={menuItems} selectedKeys={selectedKeys} />
        <Content
          className="flex flex-col px-4 py-6 shadow-md rounded-lg min-h-screen overflow-y-auto flex-1 text-text"
          style={{
            marginTop: '64px',
            marginLeft: collapsed ? '64px' : '200px',
            transition: 'margin-left 0.3s',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};
