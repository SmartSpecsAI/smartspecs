import React from "react";
import { Layout } from "antd";
import SmartSpecsLogo from "@/smartspecs/assets/images/brand/smartspecs-imagotype.svg";
import Image from "next/image";

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
          {/* <Button
            type="primary"
            shape="circle"
            icon={<MenuOutlined />}
            className="flex-grow-0 flex-shrink-0"
            style={{
              backgroundColor: "rgb(187, 207, 231)",
              borderColor: "rgb(187, 207, 231)",
            }}
          /> */}
        </nav>
      </div>
    </Header>
  );
};
