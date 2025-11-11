import type { Case, Task } from '@/types';
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

  // Helper function to truncate text to 20 characters
  const truncateText = (text: string, maxLength: number = 20): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Helper function to count incomplete tasks recursively
  const countIncompleteTasks = (tasks: Task[]): number => {
    let count = 0;
    for (const task of tasks) {
      if (task.status !== 'DONE') {
        count++;
      }
      if (task.subtasks && task.subtasks.length > 0) {
        count += countIncompleteTasks(task.subtasks);
      }
    }
    return count;
  };

  // Check if Done status should be disabled (when there are incomplete tasks)
  const incompleteTasks = countIncompleteTasks(caseData.tasks || []);
  const isDoneDisabled = incompleteTasks > 0;
  const doneDisabledMessage = isDoneDisabled
    ? `Complete ${incompleteTasks} task${incompleteTasks > 1 ? 's' : ''} first`
    : undefined;

  return (
    <EntityHeader
      breadcrumbs={[
        { label: 'Ticketing Hub', to: '/' },
        { label: truncateText(caseData.title) },
      ]}
      title={caseData.title}
      status={caseData.status}
      team={caseData.team}
      statusDisabled={isDoneDisabled}
      statusDisabledMessage={doneDisabledMessage}
      onTitleChange={handleTitleChange}
      onStatusChange={handleStatusChange}
    />
  );
}
