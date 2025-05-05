"use client";

import React from "react";
import { Layout } from "antd";
import SmartSpecsLogo from "@/smartspecs/assets/images/brand/smartspecs-imagotype.svg";
import Image from "next/image";
import ThemeToggleButton from "../common/ThemeToggleButton";
const { Header } = Layout;

export const AppHeader: React.FC = () => {

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
          </div>
        </nav>
      </div>
    </Header>
  );
};
