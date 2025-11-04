import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { mockUsers } from '@/data/mockUsers';
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
  team?: string;
  assignedTo?: string;
  onTitleChange?: (title: string) => void;
  onStatusChange?: (status: string) => void;
  onDomainChange?: (domain: string) => void;
  onTeamChange?: (team: string) => void;
  onAssignedToChange?: (userId: string) => void;
}

type DropdownType = 'status' | 'team' | 'domain' | 'assignedTo' | null;

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
  assignedTo,
  onTitleChange,
  onStatusChange,
  onDomainChange,
  onTeamChange,
  onAssignedToChange,
}: EntityHeaderProps) {
  const [openDropdown, setOpenDropdown] = useState<DropdownType>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(title);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

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

  // Sync titleValue with prop when it changes
  useEffect(() => {
    setTitleValue(title);
  }, [title]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

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

  // Handle title save
  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (titleValue.trim() && titleValue !== title) {
      onTitleChange?.(titleValue.trim());
    } else {
      setTitleValue(title); // Reset if empty or unchanged
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTitleBlur();
    } else if (e.key === 'Escape') {
      setTitleValue(title);
      setIsEditingTitle(false);
    }
  };

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

      {/* Title - Inline Editable */}
      {isEditingTitle ? (
        <input
          ref={titleInputRef}
          type="text"
          value={titleValue}
          onChange={(e) => setTitleValue(e.target.value)}
          onBlur={handleTitleBlur}
          onKeyDown={handleTitleKeyDown}
          className="mb-6 text-3xl font-normal text-neutral-900 bg-transparent border-none outline-none focus:outline-none w-full"
          placeholder="Enter title..."
        />
      ) : (
        <h1
          onClick={() => onTitleChange && setIsEditingTitle(true)}
          className={`mb-6 text-3xl font-normal text-neutral-900 ${onTitleChange ? 'cursor-text hover:bg-neutral-50 rounded px-2 -mx-2 transition-colors' : ''}`}
        >
          {title}
        </h1>
      )}

      {/* Status Row */}
      <div className="mb-3 flex items-center">
        <div className="w-24 text-sm text-neutral-600">Status</div>
        <StatusDropdown
          currentStatus={status}
          onStatusChange={(newStatus) => onStatusChange?.(newStatus)}
          open={openDropdown === 'status'}
          onOpenChange={(isOpen) => setOpenDropdown(isOpen ? 'status' : null)}
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
      {(team || domain || onAssignedToChange) && (
        <div className="flex items-center">
          <div className="w-24 text-sm text-neutral-600">Properties</div>
          <div className="flex items-center gap-6">
            {team && (
              <div className="relative">
                <button 
                  className="inline-flex items-center px-3 py-1 rounded-md hover:bg-neutral-200 transition-colors text-sm text-neutral-900"
                  onClick={() => setOpenDropdown(openDropdown === 'team' ? null : 'team')}
                >
                  <span className="font-normal text-neutral-400">Team:</span>
                  <span className="ml-1">{formatText(team)}</span>
                </button>

                {/* Team Dropdown */}
                {openDropdown === 'team' && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-50">
                    {teamOptions.map((option) => (
                      <button
                        key={option.value}
                        className="w-full flex items-center justify-between px-3 py-2.5 text-sm hover:bg-neutral-50 transition-colors cursor-pointer"
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
                  <span className="font-normal text-neutral-400">Domain:</span>
                  <span className="ml-1">{formatText(domain)}</span>
                </button>

                {/* Domain Dropdown */}
                {openDropdown === 'domain' && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-50">
                    {domainOptions.map((option) => (
                      <button
                        key={option.value}
                        className="w-full flex items-center justify-between px-3 py-2.5 text-sm hover:bg-neutral-50 transition-colors cursor-pointer"
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

            {onAssignedToChange && (
              <div className="relative">
                <button 
                  className="inline-flex items-center px-3 py-1 rounded-md hover:bg-neutral-200 transition-colors text-sm text-neutral-900"
                  onClick={() => setOpenDropdown(openDropdown === 'assignedTo' ? null : 'assignedTo')}
                >
                  <span className="font-normal text-neutral-400">Assigned To:</span>
                  <span className="ml-1">{assignedTo ? mockUsers.find(u => u.id === assignedTo)?.name || 'Unknown' : 'Not assigned'}</span>
                </button>

                {/* Assigned To Dropdown */}
                {openDropdown === 'assignedTo' && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-50">
                    <button
                      className="w-full flex items-center justify-between px-3 py-2.5 text-sm hover:bg-neutral-50 transition-colors cursor-pointer"
                      onClick={() => {
                        onAssignedToChange?.('');
                        setOpenDropdown(null);
                      }}
                    >
                      <span className="text-neutral-500">Not assigned</span>
                      {!assignedTo && (
                        <svg className="h-4 w-4 text-neutral-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    {mockUsers.map((user) => (
                      <button
                        key={user.id}
                        className="w-full flex items-center justify-between px-3 py-2.5 text-sm hover:bg-neutral-50 transition-colors cursor-pointer"
                        onClick={() => {
                          onAssignedToChange?.(user.id);
                          setOpenDropdown(null);
                        }}
                      >
                        <span className="text-neutral-900">{user.name}</span>
                        {assignedTo === user.id && (
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

