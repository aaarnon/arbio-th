import { useState, useRef, useEffect } from 'react';
import { useCaseContext } from '@/store/CaseContext';
import { NotificationItem } from './NotificationItem';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

/**
 * Notification Dropdown Component
 * Bell icon with badge that opens a dropdown with all notifications
 */
export function NotificationDropdown() {
  const { state, dispatch } = useCaseContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Count unread notifications
  const unreadCount = state.notifications.filter((n) => !n.isRead).length;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleMarkAllAsRead = () => {
    dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ' });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-neutral-100 rounded-full transition-colors"
        aria-label="Notifications"
      >
        <svg
          className="h-6 w-6 text-neutral-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {/* Badge */}
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 h-4 w-4 flex items-center justify-center text-[10px] font-medium text-white bg-red-600 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 max-h-[600px] bg-white rounded-card overflow-hidden z-50 shadow-lg border border-neutral-200">
          <Card className="border-0 shadow-none">
            {/* Header */}
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-neutral-800">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-sm text-neutral-600 hover:text-neutral-800 font-normal"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-3 mt-2">
                {unreadCount > 0 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                    {unreadCount} New
                  </span>
                )}
                <span className="text-sm text-neutral-500">
                  {state.notifications.length} total notification{state.notifications.length !== 1 ? 's' : ''}
                </span>
              </div>
            </CardHeader>

            {/* Notification List */}
            <CardContent className="p-0 max-h-[480px] overflow-y-auto">
              {state.notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <svg
                    className="h-16 w-16 text-neutral-300 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <p className="text-sm font-medium text-neutral-800 mb-1">No notifications</p>
                  <p className="text-xs text-neutral-500">You're all caught up!</p>
                </div>
              ) : (
                <div>
                  {state.notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onClose={() => setIsOpen(false)}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

