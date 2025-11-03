import { useState, useMemo } from 'react';
import type { Case, Status, DomainType } from '@/types';

interface FilterState {
  status: Status | 'ALL';
  domain: DomainType | 'ALL';
  search: string;
}

/**
 * Custom hook for filtering cases
 * Provides filter state and filtered results
 */
export function useCaseFilters(cases: Case[]) {
  const [filters, setFilters] = useState<FilterState>({
    status: 'ALL',
    domain: 'ALL',
    search: '',
  });

  // Filter cases based on current filters
  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      // Status filter
      if (filters.status !== 'ALL' && c.status !== filters.status) {
        return false;
      }

      // Domain filter
      if (filters.domain !== 'ALL' && c.domain !== filters.domain) {
        return false;
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

  const setDomainFilter = (domain: DomainType | 'ALL') => {
    setFilters((prev) => ({ ...prev, domain }));
  };

  const setSearchFilter = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      status: 'ALL',
      domain: 'ALL',
      search: '',
    });
  };

  return {
    filters,
    filteredCases,
    setStatusFilter,
    setDomainFilter,
    setSearchFilter,
    resetFilters,
  };
}

