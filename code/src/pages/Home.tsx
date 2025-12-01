import { useState } from 'react';

/**
 * Home - Daily briefing page
 * Minimalist design with schedule and tasks overview
 */
export function Home() {
  const [currentDate] = useState(new Date());
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const overdueTasks = [
    { id: 1, title: 'Create a deal', dueDate: 'Aug 19', priority: 'low' },
    { id: 2, title: 'Test Hostaway property sync and report findings', dueDate: 'Aug 27', priority: 'medium' },
    { id: 3, title: 'Add detailed auto-cancellation logic to ticket', dueDate: 'Aug 28', priority: 'low' },
  ];

  const todayTasks = [
    { id: 8, title: 'Ensure cloud project access for all team members', priority: 'medium' },
    { id: 9, title: 'Implement cancellation automation for unpaid re...', priority: 'medium' },
    { id: 16, title: 'Share PR review bookmarklet and add details to ...', priority: 'low' },
  ];

  const getPriorityIcon = (priority: string) => {
    if (priority === 'medium') {
      return (
        <svg className="h-3.5 w-3.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      );
    }
    return (
      <svg className="h-3.5 w-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    );
  };


  return (
    <div className="flex-1 bg-neutral-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-2">
            <p className="text-xs text-neutral-500 mb-1">{formatDate(currentDate)}</p>
            <h1 className="text-2xl font-semibold text-neutral-900">Daily briefing</h1>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Action Section */}
          <div>
            <h2 className="text-sm font-semibold text-neutral-900 mb-4">ACTION</h2>
            <div className="bg-neutral-100 rounded-lg p-12 flex flex-col items-center justify-center">
              <svg className="h-12 w-12 text-neutral-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-sm font-medium text-neutral-900 mb-1">No pending approval</h3>
              <p className="text-xs text-neutral-500">You don't have any items waiting for approval</p>
            </div>
          </div>

          {/* Tasks Section */}
          <div>
            <h2 className="text-sm font-semibold text-neutral-900 mb-4">Tasks</h2>
            
            {/* Overdue Tasks */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-neutral-700">Overdue</h3>
                <span className="text-xs text-neutral-500">{overdueTasks.length}</span>
              </div>
              <div className="space-y-2">
                {overdueTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-2 bg-white px-3 py-2 rounded border border-neutral-200 hover:border-neutral-300 transition-colors cursor-pointer"
                  >
                    <div className="flex-shrink-0">
                      {getPriorityIcon(task.priority)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-neutral-900 truncate">{task.title}</p>
                    </div>
                    <span className="text-[10px] text-red-500 font-medium flex-shrink-0">{task.dueDate}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Today Tasks */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-neutral-700">Today</h3>
                <span className="text-xs text-neutral-500">{todayTasks.length}</span>
                <button className="ml-auto text-neutral-400 hover:text-neutral-600">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              <div className="space-y-2">
                {todayTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-2 bg-white px-3 py-2 rounded border border-neutral-200 hover:border-neutral-300 transition-colors cursor-pointer"
                  >
                    <div className="flex-shrink-0">
                      {getPriorityIcon(task.priority)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-neutral-900 truncate">{task.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

