import { Tag } from 'antd';
import { colorByStatus, Status } from "@/smartspecs/lib/domain";

interface StatusTagProps {
  type: 'status' | 'priority' | 'itemType' | 'estimatedTime';
  value: string;
  className?: string;
}

export function StatusTag({ type, value, className = '' }: StatusTagProps) {
  const getColor = () => {
    switch (type) {
      case 'status':
        return colorByStatus(value as Status);
      case 'priority':
        return value === 'high' ? 'red' : value === 'medium' ? 'orange' : 'yellow';
      case 'itemType':
        return 'blue';
      case 'estimatedTime':
        return 'green';
      default:
        return 'default';
    }
  };

  const formatValue = (val: string) => {
    return val.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <Tag
      color={getColor()}
      className={`${className}`}
    >
      {formatValue(value)}
    </Tag>
  );
} 