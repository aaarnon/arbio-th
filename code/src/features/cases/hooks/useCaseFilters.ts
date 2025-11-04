import { useState, useMemo } from 'react';
import type { Case, Status, TeamType } from '@/types';

interface FilterState {
  status: Status | 'ALL';
  team: TeamType | 'ALL';
  date: string;
  search: string;
}

/**
 * Custom hook for filtering cases
 * Provides filter state and filtered results
 */
export function useCaseFilters(cases: Case[]) {
  const [filters, setFilters] = useState<FilterState>({
    status: 'ALL',
    team: 'ALL',
    date: 'ALL',
    search: '',
  });

  // Filter cases based on current filters
  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      // Status filter
      if (filters.status !== 'ALL' && c.status !== filters.status) {
        return false;
      }

      // Team filter
      if (filters.team !== 'ALL' && c.team !== filters.team) {
        return false;
      }

      // Date filter
      if (filters.date !== 'ALL') {
        const caseDate = new Date(c.createdAt);
        const now = new Date();
        const diffTime = now.getTime() - caseDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        switch (filters.date) {
          case 'TODAY':
            if (diffDays > 0) return false;
            break;
          case 'LAST_7_DAYS':
            if (diffDays > 7) return false;
            break;
          case 'LAST_30_DAYS':
            if (diffDays > 30) return false;
            break;
          case 'LAST_90_DAYS':
            if (diffDays > 90) return false;
            break;
        }
      }

      // Search filter (searches in title and description)
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesTitle = c.title.toLowerCase().includes(searchLower);
        const matchesDescription = c.description.toLowerCase().includes(searchLower);
        const matchesId = c.id.toLowerCase().includes(searchLower);
        
        if (!matchesTitle && !matchesDescription && !matchesId) {
          return false;
        }
      }

      return true;
    });
  }, [cases, filters]);

  // Update individual filters
  const setStatusFilter = (status: Status | 'ALL') => {
    setFilters((prev) => ({ ...prev, status }));
  };

  const setTeamFilter = (team: TeamType | 'ALL') => {
    setFilters((prev) => ({ ...prev, team }));
  };

  const setDateFilter = (date: string) => {
    setFilters((prev) => ({ ...prev, date }));
  };

  const setSearchFilter = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      status: 'ALL',
      team: 'ALL',
      date: 'ALL',
      search: '',
    });
  };

  return {
    filters,
    filteredCases,
    setStatusFilter,
    setTeamFilter,
    setDateFilter,
    setSearchFilter,
    resetFilters,
  };
}

