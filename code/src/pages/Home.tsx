import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockNotifications } from '@/data/mockNotifications';
import { formatDistanceToNow } from 'date-fns';

/**
 * Home - Daily briefing page
 * Minimalist design with schedule and tasks overview
 */
export function Home() {
  const navigate = useNavigate();
  const [currentDate] = useState(new Date());
  const [notifications, setNotifications] = useState(mockNotifications);
  
  // Get current user (in a real app, this would come from auth context)
  const currentUser = { name: 'Sarah Chen' };
  const firstName = currentUser.name.split(' ')[0];
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTicketDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'case_assigned':
        return (
          <svg className="h-5 w-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'case_updated':
        return (
          <svg className="h-5 w-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        );
      case 'comment':
        return (
          <svg className="h-5 w-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      case 'mention':
        return (
          <svg className="h-5 w-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
          </svg>
        );
      case 'task_completed':
        return (
          <svg className="h-5 w-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="h-5 w-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        );
    }
  };

  // Open tickets data
  const openTickets = [
    { 
      id: 'TK-2853', 
      title: 'Early Check-in Request for VIP Guest', 
      status: 'IN_PROGRESS',
      createdAt: '2025-11-29'
    },
    { 
      id: 'TK-2879', 
      title: 'Mold Spotted in Bathroom', 
      status: 'IN_PROGRESS',
      createdAt: '2025-11-18'
    },
    { 
      id: 'TK-2896', 
      title: 'Guest Requesting Late Checkout Extension', 
      status: 'IN_REVIEW',
      createdAt: '2025-11-17'
    },
  ];

  // Filter only unread notifications for Updates section
  const unreadNotifications = notifications.filter(n => !n.read);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'IN_REVIEW':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'DONE':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'TODO':
        return 'bg-neutral-100 text-neutral-600 border-neutral-200';
      default:
        return 'bg-neutral-100 text-neutral-600 border-neutral-200';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ');
  };


  return (
    <div className="flex-1 bg-neutral-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-2">
            <p className="text-xs text-neutral-500 mb-1">{formatDate(currentDate)}</p>
            <h1 className="text-2xl font-semibold text-neutral-900">Welcome, {firstName}</h1>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-[1.5fr,1fr] gap-6">
          {/* Left Column: AI Summary + Open Tickets */}
          <div className="space-y-6">
            {/* AI Summary Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="flex items-center gap-2 text-base font-semibold text-neutral-900 uppercase tracking-wide mb-6">
                Daily Summary
                <svg className="w-5 h-5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </h2>
              <div className="space-y-4">
                {/* Priority Tasks */}
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-neutral-900 mb-1">Priority Tasks</h3>
                    <p className="text-sm text-neutral-600 leading-relaxed">
                      You have 3 open tickets requiring immediate attention, including a VIP guest early check-in request and a maintenance issue in Unit A-101.
                    </p>
                  </div>
                </div>

                {/* Notifications */}
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-neutral-900 mb-1">Notifications</h3>
                    <p className="text-sm text-neutral-600 leading-relaxed">
                      3 new case assignments and comments need your review. Sarah Chen commented on the HVAC system issue in Unit B-305.
                    </p>
                  </div>
                </div>

                {/* Action Items */}
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-neutral-900 mb-1">Action Items</h3>
                    <p className="text-sm text-neutral-600 leading-relaxed">
                      Review and respond to the late checkout extension request (TK-2896) and follow up on the mold inspection report for Unit A-101.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Open Tickets Section */}
            <div className="bg-white rounded-lg shadow-sm pt-6 px-6 pb-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-neutral-900 uppercase tracking-wide">Open Tickets</h2>
                <button 
                  onClick={() => navigate('/cases')}
                  className="text-xs text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 transition-colors px-3 py-1.5 rounded-md"
                >
                  View history
                </button>
              </div>
              
              {/* Ticket list */}
              <div className="max-h-[600px] overflow-y-auto border-b border-neutral-100">
                {openTickets.length > 0 ? (
                  openTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      onClick={() => navigate(`/cases/${ticket.id}`)}
                      className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50 cursor-pointer transition-colors"
                    >
                      {/* Left section: ID and Title */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-xs text-neutral-400 font-medium whitespace-nowrap">
                          {ticket.id}
                        </span>
                        <span className="text-sm text-neutral-900 font-normal truncate flex-1">
                          {ticket.title}
                        </span>
                      </div>

                      {/* Right section: Status and Date */}
                      <div className="flex items-center gap-4 ml-4">
                        <span className={`inline-flex px-2.5 py-1 text-xs rounded border ${getStatusColor(ticket.status)}`}>
                          {formatStatus(ticket.status)}
                        </span>
                        <span className="text-xs text-neutral-500 whitespace-nowrap">
                          {formatTicketDate(ticket.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-neutral-500 py-4 text-center">
                    No open tickets
                  </div>
                )}
              </div>

              {/* Add Case Button */}
              <button 
                onClick={() => navigate('/cases')}
                className="w-full flex items-center justify-center gap-2 pt-3 pb-1 text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Case</span>
              </button>
            </div>
          </div>

          {/* Right Column: Updates Section */}
          <div>
            <div className="bg-white rounded-lg shadow-sm pt-6 px-4 pb-3">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-neutral-900 uppercase tracking-wide">Updates</h2>
                <button 
                  onClick={markAllAsRead}
                  className="text-xs text-neutral-500 hover:text-neutral-700 transition-colors"
                >
                  Mark as read <span className="ml-1">✓</span>
                </button>
              </div>
              
              {/* Updates List */}
              <div className="max-h-[600px] overflow-y-auto space-y-2">
                {unreadNotifications.length > 0 ? (
                  unreadNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => navigate(notification.link)}
                      className="flex items-start gap-2.5 hover:bg-neutral-50 cursor-pointer transition-colors p-2 -mx-2 rounded-lg group"
                    >
                      {/* Icon */}
                      <div className="flex-shrink-0 w-8 h-8 bg-neutral-50 rounded-lg flex items-center justify-center border border-neutral-200">
                        <div className="scale-75">
                          {getNotificationIcon(notification.type)}
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 mb-0.5">
                          <div className="flex-1">
                            <p className="text-sm text-neutral-900 font-medium mb-0.5 leading-tight">
                              {notification.title}
                            </p>
                            <p className="text-sm text-neutral-600 leading-tight">
                              {notification.message}
                            </p>
                          </div>
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                        </div>
                        <p className="text-[10px] text-neutral-500 mt-1">
                          {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-neutral-500 py-4 text-center">
                    No new updates
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

