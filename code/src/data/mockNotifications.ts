/**
 * Mock notifications for the inbox-style notifications page
 */

export interface NotificationItem {
  id: string;
  type: 'case_assigned' | 'case_updated' | 'comment' | 'mention' | 'task_completed';
  title: string;
  message: string;
  link: string;
  read: boolean;
  timestamp: string;
}

export const mockNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'case_assigned',
    title: 'New case assigned to you',
    message: 'Water Leak in Unit A-101 Bathroom has been assigned to you',
    link: '/cases/TK-2847',
    read: false,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    id: 'notif-2',
    type: 'comment',
    title: 'New comment on your case',
    message: 'Sarah Chen commented on HVAC System Not Working in Unit B-305',
    link: '/cases/TK-2848',
    read: false,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
  },
  {
    id: 'notif-3',
    type: 'mention',
    title: 'You were mentioned',
    message: 'Mike Rodriguez mentioned you in Broken dishwasher needs replacement',
    link: '/cases/TK-2849',
    read: false,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: 'notif-4',
    type: 'task_completed',
    title: 'Task completed',
    message: 'Emily Watson completed "Emergency inspection and assessment"',
    link: '/cases/TK-2847',
    read: true,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: 'notif-5',
    type: 'case_updated',
    title: 'Case status updated',
    message: 'Internet not working in Unit C-102 was marked as Done',
    link: '/cases/TK-2850',
    read: true,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  },
  {
    id: 'notif-6',
    type: 'comment',
    title: 'New comment on your case',
    message: 'David Kim commented on Smoke detector beeping in Unit A-205',
    link: '/cases/TK-2851',
    read: true,
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  },
];

