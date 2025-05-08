"use client";

import React from "react";
import { Layout, Button } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import SmartSpecsLogo from "@/smartspecs/assets/images/brand/smartspecs-imagotype.svg";
import Image from "next/image";
import ThemeToggleButton from "../common/ThemeToggleButton";
import { useLogout } from "@/smartspecs/app-lib/hooks/auth/useLogout";

const { Header } = Layout;

export const AppHeader: React.FC = () => {
  const { logout } = useLogout();

  return (
    <Header className="bg-background shadow-lg rounded-lg border-b-2 border-primary fixed top-0 left-0 right-0 z-10">
      <div className="system-header w-full">
        <nav className="navbar flex items-center justify-between p-4">
          <a
            className="navbar-brand flex items-center h-full"
            href="/"
          >
            <span className="inline-flex items-center h-7">
              <Image
                src={SmartSpecsLogo}
                height={25}
                width={97}
                alt="SmartSpecs Logo"
              />
            </span>
          </a>
          <div className="flex items-center space-x-4">
            <ThemeToggleButton />
            <Button 
              icon={<LogoutOutlined />} 
              onClick={logout}
              type="text"
              className="text-primary hover:text-primary-dark"
            >
              Logout
            </Button>
          </div>
        </nav>
      </div>
    </Header>
  );
};
