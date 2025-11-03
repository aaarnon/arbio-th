import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import type { Notification } from '@/types';
import { useCaseContext } from '@/store/CaseContext';
import { getNotificationIcon } from '../utils/notificationHelpers';

interface NotificationItemProps {
  notification: Notification;
  onClose: () => void;
}

/**
 * Notification Item Component
 * Displays a single notification with icon, title, message, and timestamp
 */
export function NotificationItem({ notification, onClose }: NotificationItemProps) {
  const { dispatch } = useCaseContext();
  const navigate = useNavigate();
  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true });

  const handleClick = () => {
    // Mark as read
    if (!notification.isRead) {
      dispatch({
        type: 'MARK_NOTIFICATION_READ',
        payload: notification.id,
      });
    }

    // Navigate to related case
    if (notification.caseId) {
      navigate(`/cases/${notification.caseId}`);
      onClose();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full text-left p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
        !notification.isRead ? 'bg-indigo-50' : ''
      }`}
    >
      <div className="flex gap-3">
        {/* Unread indicator */}
        {!notification.isRead && (
          <div className="flex-shrink-0 mt-1">
            <div className="h-2 w-2 rounded-full bg-blue-600"></div>
          </div>
        )}
        
        {/* Icon */}
        <div className="flex-shrink-0">
          {getNotificationIcon(notification.type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 mb-1">
            {notification.title}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            {notification.message}
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{timeAgo}</span>
            {notification.caseId && (
              <>
                <span>•</span>
                <span className="text-indigo-600 font-medium">
                  {notification.caseId}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

