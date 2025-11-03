import type { Case } from '@/types';
import { EntityHeader } from '@/components/shared/EntityHeader';

interface CaseHeaderProps {
  case: Case;
}

/**
 * Case Header Component - Linear-inspired flat design
 * Displays breadcrumb, title, and editable properties
 */
export function CaseHeader({ case: caseData }: CaseHeaderProps) {
  const handleStatusChange = (newStatus: string) => {
    console.log('Change case status to:', newStatus);
    // TODO: Implement actual status change logic
  };

  const handleDomainChange = (newDomain: string) => {
    console.log('Change case domain to:', newDomain);
    // TODO: Implement actual domain change logic
  };

  return (
    <EntityHeader
      breadcrumbs={[
        { label: 'Ticketing Hub', to: '/' },
        { label: caseData.id },
      ]}
      title={caseData.title}
      status={caseData.status}
      domain={caseData.domain}
      onStatusChange={handleStatusChange}
      onDomainChange={handleDomainChange}
    />
  );
}
