import { Link } from 'react-router-dom';
import { NotificationDropdown } from '@/features/notifications/components/NotificationDropdown';
import { Button } from '@/components/ui/button';

/**
 * Navigation bar component - Linear-inspired minimalist
 * Provides consistent header across all pages with subtle styling
 */
export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-neutral-200">
      <nav className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-12">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-neutral-800">
            <svg
              className="h-5 w-5 text-white"
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
          <Link to="/" className="text-base font-medium text-neutral-800">
            Ticketing Hub
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          {/* Notification Dropdown */}
          <NotificationDropdown />
          
          {/* New Case Button */}
          <Button asChild size="sm">
            <Link to="/cases/new">
              <svg 
                className="mr-2 h-4 w-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 4v16m8-8H4" 
                />
              </svg>
              New Case
            </Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}

// Updated navigation to use Link instead of modal

