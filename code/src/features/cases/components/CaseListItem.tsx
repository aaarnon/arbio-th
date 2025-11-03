import { useNavigate } from 'react-router-dom';
import type { Case } from '@/types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { DomainBadge } from '@/components/shared/DomainBadge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { formatDate, formatRelativeDate } from '@/utils/date';
import { mockUsers } from '@/data/mockUsers';

interface CaseListItemProps {
  case: Case;
}

/**
 * Case List Item Component
 * Displays a single case as a clickable card
 */
export function CaseListItem({ case: caseData }: CaseListItemProps) {
  const navigate = useNavigate();
  
  // Find assigned user
  const assignedUser = caseData.assignedTo 
    ? mockUsers.find(u => u.id === caseData.assignedTo)
    : null;

  const handleClick = () => {
    navigate(`/cases/${caseData.id}`);
  };

  return (
    <Card 
      className="cursor-pointer transition-shadow hover:shadow-md"
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
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-mono text-gray-500">{caseData.id}</span>
              <StatusBadge status={caseData.status} />
              <DomainBadge domain={caseData.domain} />
            </div>
            <CardTitle className="text-lg line-clamp-1">{caseData.title}</CardTitle>
            <CardDescription className="mt-1 line-clamp-2">
              {caseData.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
          {assignedUser && (
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>{assignedUser.name}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Created {formatRelativeDate(caseData.createdAt)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Updated {formatDate(caseData.updatedAt)}</span>
          </div>

          {caseData.tasks && caseData.tasks.length > 0 && (
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>{caseData.tasks.length} task{caseData.tasks.length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

