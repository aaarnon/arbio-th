/**
 * Notification Type
 */
export type NotificationType = 
  | 'CASE_CREATED'
  | 'CASE_UPDATED'
  | 'TASK_CREATED'
  | 'TASK_UPDATED'
  | 'TASK_COMPLETED'
  | 'COMMENT_ADDED'
  | 'ASSIGNMENT_CHANGED';

/**
 * Notification interface
 */
export interface Notification {
  /** Unique notification identifier */
  id: string;
  
  /** Type of notification */
  type: NotificationType;
  
  /** Notification title */
  title: string;
  
  /** Notification message */
  message: string;
  
  /** Related case ID */
  caseId?: string;
  
  /** Related task ID */
  taskId?: string;
  
  /** Whether the notification has been read */
  isRead: boolean;
  
  /** Timestamp when notification was created */
  createdAt: string;
}
