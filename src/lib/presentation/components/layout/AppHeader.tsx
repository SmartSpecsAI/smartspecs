import React from "react";
import { Layout } from "antd";
import SmartSpecsLogo from "@/smartspecs/assets/images/brand/smartspecs-imagotype.svg";
import Image from "next/image";
import ThemeToggleButton from "@/smartspecs/lib/components/ThemeToggleButton";

const { Header } = Layout;

export const AppHeader: React.FC = () => {
  return (
    <Header className="bg-white shadow-md">
      <div className="system-header w-full">
        <nav className="navbar flex items-center justify-between bg-white">
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
          <ThemeToggleButton />
        </nav>
      </div>
    </Header>
  );
};
