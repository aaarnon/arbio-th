import type { Case, Task, Comment, Attachment, Notification } from '@/types';

/**
 * Application state for case management
 */
export interface CaseState {
  /** Array of all cases */
  cases: Case[];
  
  /** Array of all notifications */
  notifications: Notification[];
  
  /** Loading state indicator */
  loading: boolean;
  
  /** Error message if any operation fails */
  error: string | null;
}

/**
 * Union type for all possible case-related actions
 */
export type CaseAction =
  | { type: 'ADD_CASE'; payload: Case }
  | { type: 'UPDATE_CASE'; payload: { caseId: string; updates: Partial<Case> } }
  | { type: 'DELETE_CASE'; payload: string }
  | { type: 'ADD_TASK'; payload: { caseId: string; task: Task } }
  | { type: 'UPDATE_TASK_STATUS'; payload: { caseId: string; taskId: string; status: Task['status'] } }
  | { type: 'UPDATE_TASK'; payload: { caseId: string; taskId: string; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: { caseId: string; taskId: string } }
  | { type: 'ADD_COMMENT'; payload: { caseId: string; comment: Comment } }
  | { type: 'ADD_ATTACHMENT'; payload: { caseId: string; attachment: Attachment } }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'MARK_ALL_NOTIFICATIONS_READ' }
  | { type: 'CLEAR_NOTIFICATIONS' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

