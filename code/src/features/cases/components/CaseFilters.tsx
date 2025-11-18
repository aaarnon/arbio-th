import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MultiSelect } from '@/components/ui/multi-select';
import type { Status, TeamType } from '@/types';

interface CaseFiltersProps {
  statusFilter: Status[];
  teamFilter: TeamType[];
  dateFilter: string;
  searchFilter: string;
  onStatusChange: (status: Status[]) => void;
  onTeamChange: (team: TeamType[]) => void;
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
  const statusOptions = [
    { label: 'To Do', value: 'TODO' },
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'In Review', value: 'IN_REVIEW' },
    { label: 'Done', value: 'DONE' },
    { label: 'Blocked', value: 'BLOCKED' },
    { label: 'Failed', value: 'FAILED' },
    { label: 'Duplicate', value: 'DUPLICATE' },
    { label: 'Rejected', value: 'REJECTED' },
    { label: 'Cancelled', value: 'CANCELLED' },
  ];

  const teamOptions = [
    { label: 'Property Management - DE', value: 'PROPERTY_MANAGEMENT_DE' },
    { label: 'Property Management - AT', value: 'PROPERTY_MANAGEMENT_AT' },
    { label: 'Guest Comm - DE', value: 'GUEST_COMM_DE' },
    { label: 'Guest Comm - AT', value: 'GUEST_COMM_AT' },
    { label: 'Guest Experience', value: 'GUEST_EXPERIENCE' },
    { label: 'FinOps', value: 'FINOPS' },
  ];

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
        <MultiSelect
          options={statusOptions}
          selected={statusFilter}
          onChange={onStatusChange}
          placeholder="All Statuses"
          className="w-full"
        />
      </div>

      {/* Team Filter */}
      <div className="w-[240px]">
        <MultiSelect
          options={teamOptions}
          selected={teamFilter}
          onChange={onTeamChange}
          placeholder="All Teams"
          className="w-full"
        />
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

