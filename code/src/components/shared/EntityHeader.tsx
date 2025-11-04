import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { StatusDropdown } from './StatusDropdown';

interface Breadcrumb {
  label: string;
  to?: string;
}

interface EntityHeaderProps {
  breadcrumbs: Breadcrumb[];
  title: string;
  status: string;
  domain?: string;
  onStatusChange?: (status: string) => void;
  onDomainChange?: (domain: string) => void;
}

type DropdownType = 'team' | 'type' | null;

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
  onStatusChange,
  onDomainChange,
}: EntityHeaderProps) {
  const [openDropdown, setOpenDropdown] = useState<DropdownType>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Format text to title case (first letter uppercase, rest lowercase)
  const formatText = (text: string) => {
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
    { value: 'PROPERTY', label: 'Property Management' },
    { value: 'GUEST_EXPERIENCE', label: 'Guest Experience' },
    { value: 'MAINTENANCE', label: 'Maintenance' },
    { value: 'HOUSEKEEPING', label: 'Housekeeping' },
    { value: 'FINANCE', label: 'Finance' },
    { value: 'RESERVATION', label: 'Reservation' },
  ];

  const typeOptions = [
    { value: 'RESERVATION', label: 'Reservation' },
    { value: 'PROPERTY', label: 'Property' },
    { value: 'MAINTENANCE', label: 'Maintenance' },
    { value: 'GUEST_REQUEST', label: 'Guest Request' },
    { value: 'FINANCE', label: 'Finance' },
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
        <StatusDropdown
          currentStatus={status}
          onStatusChange={(newStatus) => onStatusChange?.(newStatus)}
          trigger={
            <button className="inline-flex items-center gap-2 px-3 py-1 rounded-md hover:bg-neutral-200 transition-colors text-sm text-neutral-900">
              {formatText(status)}
              <svg className="h-4 w-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          }
        />
      </div>

      {/* Properties Row */}
      {domain && (
        <div className="flex items-center relative">
          <div className="w-24 text-sm text-neutral-600">Properties</div>
          <div className="flex items-center gap-6">
            <button 
              className="inline-flex items-center px-3 py-1 rounded-md hover:bg-neutral-200 transition-colors text-sm text-neutral-900"
              onClick={() => setOpenDropdown(openDropdown === 'team' ? null : 'team')}
            >
              <span className="font-normal text-neutral-600">Team:</span>
              <span className="ml-1">{formatText(domain)}</span>
            </button>

            {/* Team Dropdown */}
            {openDropdown === 'team' && (
              <div className="absolute top-full left-24 mt-2 w-72 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-50">
                <div className="px-3 pb-2">
                  <input 
                    type="text"
                    placeholder="Change team..."
                    className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-md focus:outline-none focus:border-neutral-400"
                    autoFocus
                  />
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {teamOptions.map((option, index) => (
                    <button
                      key={option.value}
                      className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-neutral-50 transition-colors"
                      onClick={() => {
                        onDomainChange?.(option.value);
                        setOpenDropdown(null);
                      }}
                    >
                      <span className="text-neutral-900">{option.label}</span>
                      <div className="flex items-center gap-3">
                        {domain === option.value && (
                          <svg className="h-4 w-4 text-neutral-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        <span className="text-xs text-neutral-400">{index + 1}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button 
              className="inline-flex items-center px-3 py-1 rounded-md hover:bg-neutral-200 transition-colors text-sm text-neutral-900"
              onClick={() => setOpenDropdown(openDropdown === 'type' ? null : 'type')}
            >
              <span className="font-normal text-neutral-600">Type:</span>
              <span className="ml-1">Reservation</span>
            </button>

            {/* Type Dropdown */}
            {openDropdown === 'type' && (
              <div className="absolute top-full left-96 mt-2 w-72 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-50">
                <div className="px-3 pb-2">
                  <input 
                    type="text"
                    placeholder="Change type..."
                    className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-md focus:outline-none focus:border-neutral-400"
                    autoFocus
                  />
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {typeOptions.map((option, index) => (
                    <button
                      key={option.value}
                      className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-neutral-50 transition-colors"
                      onClick={() => {
                        console.log('Change type to:', option.value);
                        setOpenDropdown(null);
                      }}
                    >
                      <span className="text-neutral-900">{option.label}</span>
                      <div className="flex items-center gap-3">
                        {option.value === 'RESERVATION' && (
                          <svg className="h-4 w-4 text-neutral-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        <span className="text-xs text-neutral-400">{index + 1}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

