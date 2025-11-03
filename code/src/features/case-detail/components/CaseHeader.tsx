import type { Case } from '@/types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { DomainBadge } from '@/components/shared/DomainBadge';
import { Button } from '@/components/ui/button';
import { formatDate, formatRelativeDate } from '@/utils/date';
import { mockUsers } from '@/data/mockUsers';

interface CaseHeaderProps {
  case: Case;
}

/**
 * Case Header Component
 * Displays case title, metadata, and actions
 */
export function CaseHeader({ case: caseData }: CaseHeaderProps) {
  const assignedUser = caseData.assignedTo 
    ? mockUsers.find(u => u.id === caseData.assignedTo)
    : null;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      {/* Top Row: ID, Badges, Actions */}
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-mono text-gray-500">{caseData.id}</span>
          <StatusBadge status={caseData.status} />
          <DomainBadge domain={caseData.domain} />
        </div>
        <Button className="border border-gray-300" size="sm">
          <svg 
            className="mr-2 h-4 w-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
            />
          </svg>
          Edit Case
        </Button>
      </div>

      {/* Title */}
      <h1 className="mb-4 text-3xl font-bold text-gray-900">{caseData.title}</h1>

      {/* Metadata */}
      <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
        {assignedUser && (
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
              />
            </svg>
            <span>
              <span className="font-medium">Assigned to:</span> {assignedUser.name}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <span>
            <span className="font-medium">Created:</span> {formatRelativeDate(caseData.createdAt)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
          <span>
            <span className="font-medium">Last updated:</span> {formatDate(caseData.updatedAt)}
          </span>
        </div>
      </div>
    </div>
  );
}

