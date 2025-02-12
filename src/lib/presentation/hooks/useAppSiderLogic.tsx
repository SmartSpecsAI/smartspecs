import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { MenuProps } from "antd";
import { FileDoneOutlined } from "@ant-design/icons";

export const useAppSiderLogic = () => {
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
      icon: <FileDoneOutlined/>,
      label: "SmartSpecs",
      onClick: () => router.push("/smartspecs"),
    },
  ];

  return {
    collapsed,
    setCollapsed,
    isMobile,
    menuItems,
    selectedKeys: [pathname.split("/")[1]],
  };
}; 