import { useState } from 'react';
import { useCaseContext } from '@/store/CaseContext';
import { useCaseFilters } from '../hooks/useCaseFilters';
import { CaseListItem } from './CaseListItem';
import { CaseFilters } from './CaseFilters';
import { CreateCaseModal } from './CreateCaseModal';
import { EmptyState } from '@/components/shared/EmptyState';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';
import { Button } from '@/components/ui/button';

/**
 * Case List Component
 * Displays all cases in a list with filters and create button
 */
export function CaseList() {
  const { state } = useCaseContext();
  const { cases, loading } = state;
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const {
    filters,
    filteredCases,
    setStatusFilter,
    setDomainFilter,
    setSearchFilter,
  } = useCaseFilters(cases);

  const handleCreateCase = () => {
    setIsCreateModalOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Cases</h1>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cases</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage and track all support cases
          </p>
        </div>
        <Button onClick={handleCreateCase}>
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
              d="M12 4v16m8-8H4" 
            />
          </svg>
          Create Case
        </Button>
      </div>

      {/* Filters */}
      <CaseFilters
        statusFilter={filters.status}
        domainFilter={filters.domain}
        searchFilter={filters.search}
        onStatusChange={setStatusFilter}
        onDomainChange={setDomainFilter}
        onSearchChange={setSearchFilter}
      />

      {/* Results Count */}
      {filteredCases.length !== cases.length && (
        <p className="text-sm text-gray-600">
          Showing {filteredCases.length} of {cases.length} cases
        </p>
      )}

      {/* Cases List */}
      {filteredCases.length === 0 ? (
        <EmptyState
          title={cases.length === 0 ? "No cases yet" : "No matching cases"}
          message={
            cases.length === 0
              ? "Get started by creating your first support case. Cases help you track and manage customer issues efficiently."
              : "Try adjusting your filters to find what you're looking for."
          }
          action={
            cases.length === 0
              ? {
                  label: 'Create First Case',
                  onClick: handleCreateCase,
                }
              : undefined
          }
        />
      ) : (
        <div className="space-y-4" role="list" aria-label="Cases list">
          {filteredCases.map((caseData) => (
            <CaseListItem key={caseData.id} case={caseData} />
          ))}
        </div>
      )}

      {/* Create Case Modal */}
      <CreateCaseModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
    </div>
  );
}

