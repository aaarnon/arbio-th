import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Status, TeamType } from '@/types';

interface CaseFiltersProps {
  statusFilter: Status | 'ALL';
  teamFilter: TeamType | 'ALL';
  dateFilter: string;
  searchFilter: string;
  onStatusChange: (status: Status | 'ALL') => void;
  onTeamChange: (team: TeamType | 'ALL') => void;
  onDateChange: (date: string) => void;
  onSearchChange: (search: string) => void;
}

/**
 * Case Filters Component
 * Provides filtering controls for the case list
 */
export function CaseFilters({
  statusFilter,
  teamFilter,
  dateFilter,
  searchFilter,
  onStatusChange,
  onTeamChange,
  onDateChange,
  onSearchChange,
}: CaseFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 bg-white rounded-card px-4 py-3">
      {/* Search Input */}
      <div className="flex-1 min-w-[240px]">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <Input
            type="text"
            placeholder="Search cases..."
            value={searchFilter}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-9"
          />
        </div>
      </div>

      {/* Status Filter */}
      <div className="w-[160px]">
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="TODO">To Do</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="BLOCKED">Blocked</SelectItem>
            <SelectItem value="IN_REVIEW">In Review</SelectItem>
            <SelectItem value="DONE">Done</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
            <SelectItem value="DUPLICATE">Duplicate</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Team Filter */}
      <div className="w-[240px]">
        <Select value={teamFilter} onValueChange={onTeamChange}>
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Team" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Teams</SelectItem>
            <SelectItem value="PROPERTY_MANAGEMENT_DE">Property Management - DE</SelectItem>
            <SelectItem value="PROPERTY_MANAGEMENT_AT">Property Management - AT</SelectItem>
            <SelectItem value="GUEST_COMM_DE">Guest Comm - DE</SelectItem>
            <SelectItem value="GUEST_COMM_AT">Guest Comm - AT</SelectItem>
            <SelectItem value="GUEST_EXPERIENCE">Guest Experience</SelectItem>
            <SelectItem value="FINOPS">FinOps</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Date Filter */}
      <div className="w-[160px]">
        <Select value={dateFilter} onValueChange={onDateChange}>
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Created" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Time</SelectItem>
            <SelectItem value="TODAY">Today</SelectItem>
            <SelectItem value="LAST_7_DAYS">Last 7 Days</SelectItem>
            <SelectItem value="LAST_30_DAYS">Last 30 Days</SelectItem>
            <SelectItem value="LAST_90_DAYS">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

