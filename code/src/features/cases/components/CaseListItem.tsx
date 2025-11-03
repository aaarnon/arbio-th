import { useNavigate } from 'react-router-dom';
import type { Case } from '@/types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatRelativeDate } from '@/utils/date';

interface CaseListItemProps {
  case: Case;
}

/**
 * Case List Item Component - Table Row
 * Displays a single case as a table row with minimalist design
 */
export function CaseListItem({ case: caseData }: CaseListItemProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/cases/${caseData.id}`);
  };

  // Format domain text to title case
  const formatDomain = (domain: string) => {
    return domain
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <tr 
      className="hover:bg-neutral-50 cursor-pointer transition-colors"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Case ID */}
      <td className="pr-6 py-2 whitespace-nowrap">
        <span className="text-sm font-medium text-neutral-400">{caseData.id}</span>
      </td>

      {/* Title with Tag */}
      <td className="px-6 py-2">
        <div>
          <div className="text-sm text-neutral-900 mb-1 line-clamp-1">{caseData.title}</div>
          <span className="inline-block text-xs text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded text-[11px]">
            {formatDomain(caseData.domain)}
          </span>
        </div>
      </td>

      {/* Status */}
      <td className="px-6 py-2 whitespace-nowrap">
        <StatusBadge status={caseData.status} />
      </td>

      {/* Created */}
      <td className="pl-6 py-2 whitespace-nowrap">
        <span className="text-sm text-neutral-500">{formatRelativeDate(caseData.createdAt)}</span>
      </td>
    </tr>
  );
}

