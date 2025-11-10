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

  const handleTitleChange = (newTitle: string) => {
    dispatch({
      type: 'UPDATE_CASE',
      payload: {
        caseId: caseData.id,
        updates: { title: newTitle },
      },
    });
    toast.success('Title updated');
  };

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

  return (
    <EntityHeader
      breadcrumbs={[
        { label: 'Ticketing Hub', to: '/' },
        { label: caseData.id },
      ]}
      title={caseData.title}
      status={caseData.status}
      team={caseData.team}
      onTitleChange={handleTitleChange}
      onStatusChange={handleStatusChange}
    />
  );
}
