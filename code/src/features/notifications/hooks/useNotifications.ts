import { useCaseContext } from '@/store/CaseContext';
import { createNotification } from '../utils/notificationHelpers';

/**
 * Hook to generate notifications for various actions
 */
export function useNotifications() {
  const { dispatch } = useCaseContext();

  const notifyCaseCreated = (caseId: string, title: string) => {
    const notification = createNotification(
      'CASE_CREATED',
      'New Case Created',
      `Case "${title}" has been created and needs assignment`,
      caseId
    );
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  };

  const notifyTaskCreated = (caseId: string, taskId: string, title: string) => {
    const notification = createNotification(
      'TASK_CREATED',
      'New Task Created',
      `Task "${title}" has been added and needs review`,
      caseId,
      taskId
    );
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  };

  const notifyTaskCompleted = (caseId: string, taskId: string, title: string) => {
    const notification = createNotification(
      'TASK_COMPLETED',
      'Task Completed',
      `Task "${title}" has been marked as complete`,
      caseId,
      taskId
    );
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  };

  const notifyCommentAdded = (caseId: string, authorName: string) => {
    const notification = createNotification(
      'COMMENT_ADDED',
      'New Comment',
      `${authorName} added a comment`,
      caseId
    );
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  };

  const notifyAssignmentChanged = (caseId: string, assigneeName: string, itemTitle: string) => {
    const notification = createNotification(
      'ASSIGNMENT_CHANGED',
      'Assignment Updated',
      `"${itemTitle}" has been assigned to ${assigneeName}`,
      caseId
    );
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  };

  return {
    notifyCaseCreated,
    notifyTaskCreated,
    notifyTaskCompleted,
    notifyCommentAdded,
    notifyAssignmentChanged,
  };
}

