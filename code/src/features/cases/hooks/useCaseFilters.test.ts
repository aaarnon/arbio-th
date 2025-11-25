import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useCaseFilters } from './useCaseFilters';
import type { Case, Status, TeamType } from '@/types';

const mockCases: Case[] = [
  {
    id: '1',
    title: 'Old Case',
    description: 'Description 1',
    status: 'OPEN' as Status,
    team: 'SUPPORT' as TeamType,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
    tasks: [],
  },
  {
    id: '2',
    title: 'New Case',
    description: 'Description 2',
    status: 'OPEN' as Status,
    team: 'ENGINEERING' as TeamType,
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z',
    tasks: [],
  },
  {
    id: '3',
    title: 'Middle Case',
    description: 'Description 3',
    status: 'CLOSED' as Status,
    team: 'SUPPORT' as TeamType,
    createdAt: '2023-01-01T12:00:00Z',
    updatedAt: '2023-01-01T12:00:00Z',
    tasks: [],
  },
];

describe('useCaseFilters', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should sort cases by createdAt descending by default', () => {
    const { result } = renderHook(() => useCaseFilters(mockCases));

    expect(result.current.filteredCases).toHaveLength(3);
    expect(result.current.filteredCases[0].id).toBe('2'); // Newest
    expect(result.current.filteredCases[1].id).toBe('3'); // Middle
    expect(result.current.filteredCases[2].id).toBe('1'); // Oldest
  });

  it('should filter by status', () => {
    const { result } = renderHook(() => useCaseFilters(mockCases));

    act(() => {
      result.current.setStatusFilter(['CLOSED' as Status]);
    });

    expect(result.current.filteredCases).toHaveLength(1);
    expect(result.current.filteredCases[0].id).toBe('3');
  });
});
