import React from "react";
import { Layout } from "antd";
import ReactLogo from "@/assets/images/57blocks-logo.svg";
import Image from "next/image";

const { Header } = Layout;

export const AppHeader: React.FC = () => {
  return (
    <Header className="px-0 bg-white">
      <div className="system-header w-100">
        <nav className="navbar navbar-expand-lg bg-white">
          <div className="container-fluid flex-nowrap px-4">
            <a
              className="navbar-brand d-inline-flex align-items-center flex-grow-0 flex-shrink-0 overflow-hidden text-nowrap"
              href="/"
            >
              <span className="d-inline-block" style={{ height: "26px" }}>
                <Image
                  src={ReactLogo}
                  height={25}
                  width={97}
                  alt="57Blocks Logo"
                />
              </span>
            </a>
            <button
              type="button"
              id="react-aria9048498645-:r0:"
              aria-expanded="false"
              className="flex-grow-0 flex-shrink-0 p-0 ms-4 border-0 rounded-circle dropdown-toggle btn btn-link"
              style={{
                width: "24px",
                height: "24px",
                backgroundColor: "rgb(187, 207, 231)",
                backgroundSize: "100%",
                border: "1px solid rgb(187, 207, 231)",
              }}
            ></button>
          </div>
        </nav>
      </div>
    </Header>
  );
};
