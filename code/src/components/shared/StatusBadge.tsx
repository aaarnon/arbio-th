import type { Status } from '@/types';
import { STATUS_STYLES } from '@/utils/constants';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

/**
 * Status Badge Component
 * Displays a styled badge for task/case status
 */
export function StatusBadge({ status, className }: StatusBadgeProps) {
  // Format status text: replace underscores with spaces
  const displayText = status.replace(/_/g, ' ');
  
  return (
    <Badge 
      className={`${STATUS_STYLES[status]} ${className || ''}`}
    >
      {displayText}
    </Badge>
  );
}

