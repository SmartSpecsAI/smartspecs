import { Button, ButtonProps } from "antd";
import React from "react";

interface StandardButtonProps extends ButtonProps {
  buttonVariant?: "primary" | "secondary" | "cancel";
  isLoading?: boolean;
}

export const StandardButton: React.FC<StandardButtonProps> = ({
  buttonVariant = "primary",
  children,
  isLoading = false,
  style,
  ...props
}) => {
  const getButtonProps = () => {
    switch (buttonVariant) {
      case "primary":
        return {
          type: "primary" as const,
          style: { ...style }
        };
      case "secondary":
        return {
          type: "default" as const,
          style: { ...style }
        };
      case "cancel":
        return {
          type: "default" as const,
          style: { float: "left" as const, ...style }
        };
      default:
        return {
          type: "primary" as const,
          style: { ...style }
        };
    }
  };

  return (
    <Button {...getButtonProps()} loading={isLoading} {...props}>
      {children}
    </Button>
  );
}; 