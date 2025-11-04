import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

interface Breadcrumb {
  label: string;
  to?: string;
}

interface EntityHeaderProps {
  breadcrumbs: Breadcrumb[];
  title: string;
  status: string;
  domain?: string;
  team?: string;
  onStatusChange?: (status: string) => void;
  onDomainChange?: (domain: string) => void;
  onTeamChange?: (team: string) => void;
}

type DropdownType = 'status' | 'team' | 'domain' | null;

/**
 * Shared Entity Header Component - Linear-inspired flat design
 * Used by both Case and Task detail pages
 * Displays breadcrumb, title, and editable properties
 */
export function EntityHeader({
  breadcrumbs,
  title,
  status,
  domain,
  team,
  onStatusChange,
  onDomainChange,
  onTeamChange,
}: EntityHeaderProps) {
  const [openDropdown, setOpenDropdown] = useState<DropdownType>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Format text to display format
  const formatText = (text: string) => {
    // Special mapping for team names to preserve exact formatting
    const teamMapping: Record<string, string> = {
      'PROPERTY_MANAGEMENT': 'Property Management',
      'GUEST_COMM': 'Guest Comm',
      'GUEST_EXPERIENCE': 'Guest Experience',
      'FINOPS': 'FinOps',
    };
    
    // Check if it's a team value
    if (teamMapping[text]) {
      return teamMapping[text];
    }
    
    // Default formatting for other values (domains, statuses)
    return text
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Dropdown options
  const teamOptions = [
    { value: 'PROPERTY_MANAGEMENT', label: 'Property Management' },
    { value: 'GUEST_COMM', label: 'Guest Comm' },
    { value: 'GUEST_EXPERIENCE', label: 'Guest Experience' },
    { value: 'FINOPS', label: 'FinOps' },
  ];

  const domainOptions = [
    { value: 'PROPERTY', label: 'Property' },
    { value: 'RESERVATION', label: 'Reservation' },
    { value: 'FINANCE', label: 'Finance' },
  ];

  const statusOptions = [
    { value: 'TODO', label: 'To Do' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'DONE', label: 'Done' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];

  return (
    <div className="mb-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-neutral-600">
        {breadcrumbs.map((crumb, index) => (
          <div key={index} className="flex items-center gap-2">
            {index > 0 && (
              <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
            {crumb.to ? (
              <Link to={crumb.to} className="hover:text-neutral-900 transition-colors">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-neutral-900 font-medium">{crumb.label}</span>
            )}
          </div>
        ))}
      </div>

      {/* Title */}
      <h1 className="mb-6 text-3xl font-normal text-neutral-900">{title}</h1>

      {/* Status Row */}
      <div className="mb-3 flex items-center">
        <div className="w-24 text-sm text-neutral-600">Status</div>
        <div className="relative">
          <button 
            className="inline-flex items-center gap-2 px-3 py-1 rounded-md hover:bg-neutral-200 transition-colors text-sm text-neutral-900"
            onClick={() => setOpenDropdown(openDropdown === 'status' ? null : 'status')}
          >
            {formatText(status)}
            <svg className="h-4 w-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Status Dropdown */}
          {openDropdown === 'status' && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-50">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-sm hover:bg-neutral-50 transition-colors"
                  onClick={() => {
                    onStatusChange?.(option.value);
                    setOpenDropdown(null);
                  }}
                >
                  <span className="text-neutral-900">{option.label}</span>
                  {status === option.value && (
                    <svg className="h-4 w-4 text-neutral-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Properties Row */}
      {(team || domain) && (
        <div className="flex items-center">
          <div className="w-24 text-sm text-neutral-600">Properties</div>
          <div className="flex items-center gap-6">
            {team && (
              <div className="relative">
                <button 
                  className="inline-flex items-center px-3 py-1 rounded-md hover:bg-neutral-200 transition-colors text-sm text-neutral-900"
                  onClick={() => setOpenDropdown(openDropdown === 'team' ? null : 'team')}
                >
                  <span className="font-normal text-neutral-600">Team:</span>
                  <span className="ml-1">{formatText(team)}</span>
                </button>

                {/* Team Dropdown */}
                {openDropdown === 'team' && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-50">
                    {teamOptions.map((option) => (
                      <button
                        key={option.value}
                        className="w-full flex items-center justify-between px-3 py-2.5 text-sm hover:bg-neutral-50 transition-colors"
                        onClick={() => {
                          onTeamChange?.(option.value);
                          setOpenDropdown(null);
                        }}
                      >
                        <span className="text-neutral-900">{option.label}</span>
                        {team === option.value && (
                          <svg className="h-4 w-4 text-neutral-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {domain && (
              <div className="relative">
                <button 
                  className="inline-flex items-center px-3 py-1 rounded-md hover:bg-neutral-200 transition-colors text-sm text-neutral-900"
                  onClick={() => setOpenDropdown(openDropdown === 'domain' ? null : 'domain')}
                >
                  <span className="font-normal text-neutral-600">Domain:</span>
                  <span className="ml-1">{formatText(domain)}</span>
                </button>

                {/* Domain Dropdown */}
                {openDropdown === 'domain' && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-50">
                    {domainOptions.map((option) => (
                      <button
                        key={option.value}
                        className="w-full flex items-center justify-between px-3 py-2.5 text-sm hover:bg-neutral-50 transition-colors"
                        onClick={() => {
                          onDomainChange?.(option.value);
                          setOpenDropdown(null);
                        }}
                      >
                        <span className="text-neutral-900">{option.label}</span>
                        {domain === option.value && (
                          <svg className="h-4 w-4 text-neutral-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

