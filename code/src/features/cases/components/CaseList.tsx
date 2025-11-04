import { useCaseContext } from '@/store/CaseContext';
import { useCaseFilters } from '../hooks/useCaseFilters';
import { CaseListItem } from './CaseListItem';
import { CaseFilters } from './CaseFilters';
import { EmptyState } from '@/components/shared/EmptyState';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';

/**
 * Case List Component
 * Displays all cases in a list with filters
 */
export function CaseList() {
  const { state } = useCaseContext();
  const { cases, loading } = state;
  
  const {
    filters,
    filteredCases,
    setStatusFilter,
    setTeamFilter,
    setDateFilter,
    setSearchFilter,
  } = useCaseFilters(cases);

  if (loading) {
    return (
      <div className="max-w-content mx-auto">
        <div className="mb-4">
          <h1 className="text-xl font-normal text-neutral-900">Cases</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Manage and track all support cases
          </p>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-content mx-auto">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-normal text-neutral-900">Cases</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Manage and track all support cases
        </p>
      </div>

      {/* Filters */}
      <div className="mb-4">
        <CaseFilters
          statusFilter={filters.status}
          teamFilter={filters.team}
          dateFilter={filters.date}
          searchFilter={filters.search}
          onStatusChange={setStatusFilter}
          onTeamChange={setTeamFilter}
          onDateChange={setDateFilter}
          onSearchChange={setSearchFilter}
        />
      </div>

      {/* Results Count */}
      {filteredCases.length !== cases.length && (
        <p className="text-xs text-neutral-400 mb-3">
          Showing {filteredCases.length} of {cases.length} cases
        </p>
      )}

      {/* Cases List */}
      {filteredCases.length === 0 ? (
        <EmptyState
          title={cases.length === 0 ? "No cases yet" : "No matching cases"}
          message={
            cases.length === 0
              ? "Get started by creating your first case using the New Case button in the navbar"
              : "Try adjusting your filters to find what you're looking for."
          }
        />
      ) : (
        <div className="bg-white rounded-card p-3">
          <table className="w-full table-fixed">
            <colgroup>
              <col style={{ width: '12%' }} />
              <col style={{ width: '58%' }} />
              <col style={{ width: '18%' }} />
              <col style={{ width: '12%' }} />
            </colgroup>
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="text-left pl-3 pr-3 pb-3 pt-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Case ID
                </th>
                <th className="text-left px-3 pb-3 pt-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="text-left px-3 pb-3 pt-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left pl-3 pr-3 pb-3 pt-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Created
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.map((caseData) => (
                <CaseListItem key={caseData.id} case={caseData} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

