import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Status, DomainType } from '@/types';

interface CaseFiltersProps {
  statusFilter: Status | 'ALL';
  domainFilter: DomainType | 'ALL';
  searchFilter: string;
  onStatusChange: (status: Status | 'ALL') => void;
  onDomainChange: (domain: DomainType | 'ALL') => void;
  onSearchChange: (search: string) => void;
}

/**
 * Case Filters Component
 * Provides filtering controls for the case list
 */
export function CaseFilters({
  statusFilter,
  domainFilter,
  searchFilter,
  onStatusChange,
  onDomainChange,
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
            <SelectItem value="DONE">Done</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Domain Filter */}
      <div className="w-[160px]">
        <Select value={domainFilter} onValueChange={onDomainChange}>
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Domain" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Domains</SelectItem>
            <SelectItem value="PROPERTY">Property</SelectItem>
            <SelectItem value="RESERVATION">Reservation</SelectItem>
            <SelectItem value="FINANCE">Finance</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

