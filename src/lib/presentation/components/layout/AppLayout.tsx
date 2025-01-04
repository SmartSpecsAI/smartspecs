"use client";
import { Layout, Menu } from "antd";
import { ReactNode } from "react";
import { AppHeader } from "./AppHeader";
import { AppSider } from "./AppSider";

interface LayoutProps {
  children: ReactNode;
}
const { Header, Content, Footer, Sider } = Layout;

export const AppLayout = ({ children }: LayoutProps) => {
  return (
    <Layout>
      <AppHeader />
      <Layout hasSider className="h-auto md:overflow-hidden">
        <AppSider></AppSider>
        <Content className="d-flex flex-column px-3 py-4 page-container min-h-100">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};
