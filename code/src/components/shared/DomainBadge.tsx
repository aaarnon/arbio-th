import type { DomainType } from '@/types';
import { DOMAIN_STYLES } from '@/utils/constants';
import { Badge } from '@/components/ui/badge';

interface DomainBadgeProps {
  domain: DomainType;
  className?: string;
}

/**
 * Domain Badge Component
 * Displays a styled badge for case domain/category
 */
export function DomainBadge({ domain, className }: DomainBadgeProps) {
  return (
    <Badge 
      className={`${DOMAIN_STYLES[domain]} ${className || ''}`}
    >
      {domain}
    </Badge>
  );
}

