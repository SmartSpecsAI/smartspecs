import { Card, Typography } from "antd";
import { ReactNode } from "react";

const { Title } = Typography;

interface DetailCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function DetailCard({ title, children, className = "" }: DetailCardProps) {
  return (
    <Card className={`card bg-gray-50 border ${className}`}>
      <Title level={5} className="text-gray-700">
        {title}
      </Title>
      {children}
    </Card>
  );
} 