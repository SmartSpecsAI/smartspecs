import { Button } from "antd";
import { ButtonProps } from "antd/lib/button";

interface IconButtonProps extends ButtonProps {
  label: string;
  icon?: React.ReactNode;
}

export function IconButton({
  label,
  icon,
  className = "",
  ...props
}: IconButtonProps) {
  return (
    <Button
      {...props}
      icon={icon}
      className={`
        rounded-md
        font-medium
        flex
        items-center
        justify-center
        ${className}
      `}
    >
      <span className={`text-[15px] ${icon ? 'ml-2' : ''}`}>{label}</span>
    </Button>
  );
}
