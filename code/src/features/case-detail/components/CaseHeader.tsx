import type { Case } from '@/types';
import { EntityHeader } from '@/components/shared/EntityHeader';
import { useCaseContext } from '@/store/CaseContext';
import { toast } from 'sonner';

interface CaseHeaderProps {
  case: Case;
}

/**
 * Case Header Component - Linear-inspired flat design
 * Displays breadcrumb, title, and editable properties
 */
export function CaseHeader({ case: caseData }: CaseHeaderProps) {
  const { dispatch } = useCaseContext();

  const handleStatusChange = (newStatus: string) => {
    dispatch({
      type: 'UPDATE_CASE',
      payload: {
        caseId: caseData.id,
        updates: { status: newStatus as any },
      },
    });
    toast.success('Status updated');
  };

  const handleTeamChange = (newTeam: string) => {
    dispatch({
      type: 'UPDATE_CASE',
      payload: {
        caseId: caseData.id,
        updates: { team: newTeam as any },
      },
    });
    toast.success('Team updated');
  };

  const handleDomainChange = (newDomain: string) => {
    dispatch({
      type: 'UPDATE_CASE',
      payload: {
        caseId: caseData.id,
        updates: { domain: newDomain as any },
      },
    });
    toast.success('Domain updated');
  };

  const handleAssignedToChange = (newUserId: string) => {
    dispatch({
      type: 'UPDATE_CASE',
      payload: {
        caseId: caseData.id,
        updates: { assignedTo: newUserId || undefined },
      },
    });
    toast.success('Assignment updated');
  };

  return (
    <EntityHeader
      breadcrumbs={[
        { label: 'Ticketing Hub', to: '/' },
        { label: caseData.id },
      ]}
      title={caseData.title}
      status={caseData.status}
      team={caseData.team}
      domain={caseData.domain}
      assignedTo={caseData.assignedTo}
      onStatusChange={handleStatusChange}
      onTeamChange={handleTeamChange}
      onDomainChange={handleDomainChange}
      onAssignedToChange={handleAssignedToChange}
    />
  );
}
