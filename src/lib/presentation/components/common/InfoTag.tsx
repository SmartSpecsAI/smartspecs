import { Tag, Typography } from "antd";
import { ReactNode } from "react";

const { Text } = Typography;

interface InfoTagProps {
  icon: ReactNode;
  color: string;
  label: string;
  value: string;
  style?: React.CSSProperties;
}

export const InfoTag: React.FC<InfoTagProps> = ({
  icon,
  color,
  label,
  value,
  style
}) => {
  return (
    <Tag
      icon={icon}
      color={color}
      style={{ whiteSpace: "normal", height: "auto", ...style }}
    >
      <Text strong className="mr-2">
        {label}:
      </Text>
      <Text style={{ wordBreak: "break-word" }}>
        {value}
      </Text>
    </Tag>
  );
}; 