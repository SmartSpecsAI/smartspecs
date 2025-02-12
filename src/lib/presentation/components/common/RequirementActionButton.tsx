import { Button } from "antd";
import { ButtonProps } from "antd/lib/button";

interface RequirementActionButtonProps extends ButtonProps {
  label: string;
  icon?: React.ReactNode;
}

export function RequirementActionButton({
  label,
  icon,
  className = "",
  ...props
}: RequirementActionButtonProps) {
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
