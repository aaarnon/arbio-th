import { Link } from 'react-router-dom';
import { NotificationDropdown } from '@/features/notifications/components/NotificationDropdown';

/**
 * Navigation bar component
 * Provides consistent header across all pages
 */
export function Navbar() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <Link to="/" className="text-xl font-bold text-gray-900">
            Ticketing Hub
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-sm font-medium text-gray-700 transition-colors hover:text-indigo-600"
          >
            Cases
          </Link>
          
          {/* Notification Dropdown */}
          <NotificationDropdown />
        </div>
      </nav>
    </header>
  );
}

