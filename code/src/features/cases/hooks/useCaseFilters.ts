import { useState, useMemo, useEffect } from 'react';
import type { Case, Status, TeamType } from '@/types';

interface FilterState {
  status: Status[];
  team: TeamType[];
  date: string;
  search: string;
}

const FILTER_STORAGE_KEY = 'ticketing-hub-case-filters';

/**
 * Load filters from localStorage
 */
function loadFiltersFromStorage(): FilterState {
  try {
    const saved = localStorage.getItem(FILTER_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Handle migration from old single-value format
      return {
        status: Array.isArray(parsed.status) ? parsed.status : [],
        team: Array.isArray(parsed.team) ? parsed.team : [],
        date: parsed.date || 'ALL',
        search: parsed.search || '',
      };
    }
  } catch (error) {
    console.error('Failed to load filters from localStorage:', error);
  }
  
  return {
    status: [],
    team: [],
    date: 'ALL',
    search: '',
  };
}

/**
 * Save filters to localStorage
 */
function saveFiltersToStorage(filters: FilterState): void {
  try {
    localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filters));
  } catch (error) {
    console.error('Failed to save filters to localStorage:', error);
  }
}

/**
 * Custom hook for filtering cases
 * Provides filter state and filtered results with persistence
 */
export function useCaseFilters(cases: Case[]) {
  const [filters, setFilters] = useState<FilterState>(loadFiltersFromStorage);

  // Save filters to localStorage whenever they change
  useEffect(() => {
    saveFiltersToStorage(filters);
  }, [filters]);

  // Filter cases based on current filters
  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      // Status filter - show all if empty array, otherwise check if status is in the array
      if (filters.status.length > 0 && !filters.status.includes(c.status)) {
        return false;
      }

      // Team filter - show all if empty array, otherwise check if team is in the array
      if (filters.team.length > 0 && c.team && !filters.team.includes(c.team)) {
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
  const setStatusFilter = (status: Status[]) => {
    setFilters((prev) => ({ ...prev, status }));
  };

  const setTeamFilter = (team: TeamType[]) => {
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
      status: [],
      team: [],
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

