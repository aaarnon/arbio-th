import { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockNotifications } from '@/data/mockNotifications';
import { formatDistanceToNow } from 'date-fns';

/**
 * Notifications Inbox Page - Linear-inspired
 * Shows all notifications in an inbox-style view
 */
export function Notifications() {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  
  const filteredNotifications = filter === 'unread'
    ? mockNotifications.filter((n) => !n.read)
    : mockNotifications;

  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'case_assigned':
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100">
            <svg className="h-4 w-4 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        );
      case 'case_updated':
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100">
            <svg className="h-4 w-4 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
        );
      case 'comment':
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100">
            <svg className="h-4 w-4 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        );
      case 'mention':
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100">
            <svg className="h-4 w-4 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100">
            <svg className="h-4 w-4 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-neutral-200">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-neutral-900">Inbox</h1>
          {unreadCount > 0 && (
            <span className="flex items-center justify-center min-w-[24px] h-6 px-2 bg-neutral-900 text-white text-xs font-medium rounded">
              {unreadCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              filter === 'all'
                ? 'bg-neutral-100 text-neutral-900'
                : 'text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              filter === 'unread'
                ? 'bg-neutral-100 text-neutral-900'
                : 'text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            Unread
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-32 h-32 mb-6 text-neutral-300">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-lg font-medium text-neutral-900 mb-2">
              {filter === 'unread' ? 'All caught up!' : 'No notifications'}
            </h2>
            <p className="text-sm text-neutral-500 max-w-sm">
              {filter === 'unread'
                ? "You've read all your notifications."
                : 'Notifications about case updates, comments, and mentions will appear here.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {filteredNotifications.map((notification) => (
              <Link
                key={notification.id}
                to={notification.link}
                className={`flex items-start gap-4 px-8 py-4 hover:bg-neutral-50 transition-colors ${
                  !notification.read ? 'bg-blue-50/30' : ''
                }`}
              >
                {/* Icon */}
                {getNotificationIcon(notification.type)}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <p className="text-sm text-neutral-900 font-medium">
                      {notification.title}
                    </p>
                    <span className="text-xs text-neutral-500 whitespace-nowrap">
                      {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600">{notification.message}</p>
                </div>

                {/* Unread Indicator */}
                {!notification.read && (
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2" />
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

