import { useNavigate } from 'react-router-dom';
import type { Case } from '@/types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatShortDate } from '@/utils/date';

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

  // Format team text with proper display names
  const formatTeam = (team?: string) => {
    if (!team) return 'No Team';
    
    // Special mapping for team names to preserve exact formatting
    const teamMapping: Record<string, string> = {
      'PROPERTY_MANAGEMENT': 'Property Management',
      'GUEST_COMM': 'Guest Comm',
      'GUEST_EXPERIENCE': 'Guest Experience',
      'FINOPS': 'FinOps',
    };
    
    return teamMapping[team] || team;
  };

  return (
    <tr 
      className="hover:bg-neutral-100 cursor-pointer transition-colors h-14 border-b border-neutral-100 last:border-b-0 rounded-md"
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
      <td className="pl-3 pr-3 py-3 whitespace-nowrap rounded-l-md">
        <span className="text-sm font-normal text-neutral-400">{caseData.id}</span>
      </td>

      {/* Title with Tag */}
      <td className="px-3 py-3">
        <div>
          <div className="text-sm font-normal text-neutral-900 mb-0.5 line-clamp-1">{caseData.title}</div>
          <span className="inline-block text-[11px] text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded">
            {formatTeam(caseData.team)}
          </span>
        </div>
      </td>

      {/* Status */}
      <td className="px-3 py-3 whitespace-nowrap">
        <StatusBadge status={caseData.status} />
      </td>

      {/* Created */}
      <td className="pl-3 pr-3 py-3 whitespace-nowrap rounded-r-md">
        <span className="text-sm font-normal text-neutral-500">{formatShortDate(caseData.createdAt)}</span>
      </td>
    </tr>
  );
}

