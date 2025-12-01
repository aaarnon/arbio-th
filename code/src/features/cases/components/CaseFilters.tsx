import { useState, useRef, useEffect } from 'react';
import type { Status, TeamType } from '@/types';
import { mockReservations } from '@/data/mockReservations';
import { mockListings } from '@/data/mockListings';

interface CaseFiltersProps {
  statusFilter: Status[];
  teamFilter: TeamType[];
  dateFilter: string;
  searchFilter: string;
  reservationsFilter: string[];
  apartmentsFilter: string[];
  onStatusChange: (status: Status[]) => void;
  onTeamChange: (team: TeamType[]) => void;
  onDateChange: (date: string) => void;
  onSearchChange: (search: string) => void;
  onReservationsChange: (reservations: string[]) => void;
  onApartmentsChange: (apartments: string[]) => void;
}

/**
 * Case Filters Component
 * Provides filtering controls for the case list
 */
export function CaseFilters({
  statusFilter,
  teamFilter,
  dateFilter,
  searchFilter,
  reservationsFilter,
  apartmentsFilter,
  onStatusChange,
  onTeamChange,
  onDateChange,
  onSearchChange,
  onReservationsChange,
  onApartmentsChange,
}: CaseFiltersProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [reservationSearch, setReservationSearch] = useState('');
  const [apartmentSearch, setApartmentSearch] = useState('');
  const filterRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
        setActiveSubmenu(null);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const statusOptions = [
    { label: 'To Do', value: 'TODO' },
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'In Review', value: 'IN_REVIEW' },
    { label: 'Done', value: 'DONE' },
    { label: 'Blocked', value: 'BLOCKED' },
    { label: 'Failed', value: 'FAILED' },
    { label: 'Duplicate', value: 'DUPLICATE' },
    { label: 'Rejected', value: 'REJECTED' },
    { label: 'Cancelled', value: 'CANCELLED' },
  ];

  const teamOptions = [
    { label: 'Property Management - DE', value: 'PROPERTY_MANAGEMENT_DE' },
    { label: 'Property Management - AT', value: 'PROPERTY_MANAGEMENT_AT' },
    { label: 'Guest Comm', value: 'GUEST_COMM' },
    { label: 'Guest Experience', value: 'GUEST_EXPERIENCE' },
    { label: 'FinOps', value: 'FINOPS' },
  ];

  const dateOptions = [
    { label: 'All Time', value: 'ALL' },
    { label: 'Today', value: 'TODAY' },
    { label: 'Last 7 Days', value: 'LAST_7_DAYS' },
    { label: 'Last 30 Days', value: 'LAST_30_DAYS' },
    { label: 'Last 90 Days', value: 'LAST_90_DAYS' },
  ];

  // Handle filter toggle for Status and Team
  const handleStatusToggle = (value: Status) => {
    const newStatus = statusFilter.includes(value)
      ? statusFilter.filter(s => s !== value)
      : [...statusFilter, value];
    onStatusChange(newStatus);
  };

  const handleTeamToggle = (value: TeamType) => {
    const newTeam = teamFilter.includes(value)
      ? teamFilter.filter(t => t !== value)
      : [...teamFilter, value];
    onTeamChange(newTeam);
  };

  const handleReservationToggle = (value: string) => {
    const newReservations = reservationsFilter.includes(value)
      ? reservationsFilter.filter(r => r !== value)
      : [...reservationsFilter, value];
    onReservationsChange(newReservations);
  };

  const handleApartmentToggle = (value: string) => {
    const newApartments = apartmentsFilter.includes(value)
      ? apartmentsFilter.filter(a => a !== value)
      : [...apartmentsFilter, value];
    onApartmentsChange(newApartments);
  };

  // Remove specific filter
  const removeStatusFilter = (value: Status) => {
    onStatusChange(statusFilter.filter(s => s !== value));
  };

  const removeTeamFilter = (value: TeamType) => {
    onTeamChange(teamFilter.filter(t => t !== value));
  };

  const removeReservationFilter = (value: string) => {
    onReservationsChange(reservationsFilter.filter(r => r !== value));
  };

  const removeApartmentFilter = (value: string) => {
    onApartmentsChange(apartmentsFilter.filter(a => a !== value));
  };

  const removeDateFilter = () => {
    onDateChange('ALL');
  };

  // Clear all filters
  const clearAllFilters = () => {
    onStatusChange([]);
    onTeamChange([]);
    onDateChange('ALL');
    onReservationsChange([]);
    onApartmentsChange([]);
  };

  // Get all selected filter tags
  const getFilterTags = () => {
    const tags: Array<{ type: 'status' | 'team' | 'date' | 'reservation' | 'apartment'; value: string; label: string }> = [];
    
    statusFilter.forEach(status => {
      const option = statusOptions.find(opt => opt.value === status);
      if (option) {
        tags.push({ type: 'status', value: status, label: `Status: ${option.label}` });
      }
    });
    
    teamFilter.forEach(team => {
      const option = teamOptions.find(opt => opt.value === team);
      if (option) {
        tags.push({ type: 'team', value: team, label: `Team: ${option.label}` });
      }
    });
    
    reservationsFilter.forEach(resId => {
      const reservation = mockReservations.find(r => r.id === resId);
      if (reservation) {
        tags.push({ type: 'reservation', value: resId, label: `Reservation: ${reservation.guestName}` });
      }
    });
    
    apartmentsFilter.forEach(propId => {
      const listing = mockListings.find(l => l.sku === propId || l.id === propId);
      if (listing) {
        tags.push({ type: 'apartment', value: propId, label: `Apartment: ${listing.name}` });
      }
    });
    
    if (dateFilter !== 'ALL') {
      const option = dateOptions.find(opt => opt.value === dateFilter);
      if (option) {
        tags.push({ type: 'date', value: dateFilter, label: `Date: ${option.label}` });
      }
    }
    
    return tags;
  };

  // Filter reservations and apartments based on search
  const filteredReservations = mockReservations.filter(res => {
    const searchLower = reservationSearch.toLowerCase();
    return res.guestName.toLowerCase().includes(searchLower) || 
           res.id.toLowerCase().includes(searchLower);
  });

  const filteredApartments = mockListings.filter(listing => {
    const searchLower = apartmentSearch.toLowerCase();
    return listing.name.toLowerCase().includes(searchLower) || 
           listing.sku.toLowerCase().includes(searchLower);
  });

  const hasActiveFilters = statusFilter.length > 0 || teamFilter.length > 0 || dateFilter !== 'ALL' || 
                          reservationsFilter.length > 0 || apartmentsFilter.length > 0;

  return (
    <div className="bg-white rounded-card p-3">
      <div className="flex items-center gap-3">
        {/* Filter Button */}
        <div className="relative" ref={filterRef}>
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-md transition-colors"
          >
            <svg
              className="h-4 w-4 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4h18M6 8h12M9 12h6"
              />
            </svg>
            <span className="leading-none">Filter</span>
          </button>

          {/* Filter Dropdown */}
          {isFilterOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-neutral-200 z-50">
              {/* Filter Options */}
              <div className="py-1">
                {/* Status */}
                <button
                  onClick={() => setActiveSubmenu(activeSubmenu === 'status' ? null : 'status')}
                  className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-neutral-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs text-neutral-900">Status</span>
                  </div>
                  <svg className="h-3 w-3 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Team */}
                <button
                  onClick={() => setActiveSubmenu(activeSubmenu === 'team' ? null : 'team')}
                  className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-neutral-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-xs text-neutral-900">Team</span>
                  </div>
                  <svg className="h-3 w-3 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Date */}
                <button
                  onClick={() => setActiveSubmenu(activeSubmenu === 'date' ? null : 'date')}
                  className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-neutral-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs text-neutral-900">Date created</span>
                  </div>
                  <svg className="h-3 w-3 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Reservations */}
                <button
                  onClick={() => setActiveSubmenu(activeSubmenu === 'reservation' ? null : 'reservation')}
                  className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-neutral-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    <span className="text-xs text-neutral-900">Reservations</span>
                  </div>
                  <svg className="h-3 w-3 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Apartment */}
                <button
                  onClick={() => setActiveSubmenu(activeSubmenu === 'apartment' ? null : 'apartment')}
                  className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-neutral-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="text-xs text-neutral-900">Apartment</span>
                  </div>
                  <svg className="h-3 w-3 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Submenu Panel */}
              {activeSubmenu && (
                <div className="absolute left-full top-0 ml-2 w-64 bg-white rounded-lg shadow-lg border border-neutral-200">
                  <div className="py-1 max-h-64 overflow-y-auto">
                    {activeSubmenu === 'status' && (
                      <>
                        {statusOptions.map((option) => (
                          <label key={option.value} className="px-3 py-1.5 flex items-center gap-2 hover:bg-neutral-50 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="rounded border-neutral-300 w-3 h-3" 
                              checked={statusFilter.includes(option.value as Status)}
                              onChange={() => handleStatusToggle(option.value as Status)}
                            />
                            <span className="text-xs text-neutral-900">{option.label}</span>
                          </label>
                        ))}
                      </>
                    )}
                    {activeSubmenu === 'team' && (
                      <>
                        {teamOptions.map((option) => (
                          <label key={option.value} className="px-3 py-1.5 flex items-center gap-2 hover:bg-neutral-50 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="rounded border-neutral-300 w-3 h-3" 
                              checked={teamFilter.includes(option.value as TeamType)}
                              onChange={() => handleTeamToggle(option.value as TeamType)}
                            />
                            <span className="text-xs text-neutral-900">{option.label}</span>
                          </label>
                        ))}
                      </>
                    )}
                    {activeSubmenu === 'date' && (
                      <>
                        {dateOptions.map((option) => (
                          <label key={option.value} className="px-3 py-1.5 flex items-center gap-2 hover:bg-neutral-50 cursor-pointer">
                            <input 
                              type="radio" 
                              name="date"
                              className="rounded-full border-neutral-300 w-3 h-3" 
                              checked={dateFilter === option.value}
                              onChange={() => onDateChange(option.value)}
                            />
                            <span className="text-xs text-neutral-900">{option.label}</span>
                          </label>
                        ))}
                      </>
                    )}
                    {activeSubmenu === 'reservation' && (
                      <>
                        <div className="px-3 py-2 border-b border-neutral-100 sticky top-0 bg-white">
                          <div className="relative">
                            <svg
                              className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-neutral-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                              />
                            </svg>
                            <input
                              type="text"
                              placeholder="Filter..."
                              value={reservationSearch}
                              onChange={(e) => setReservationSearch(e.target.value)}
                              className="w-full pl-7 pr-2 py-1 text-xs border border-neutral-200 rounded focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>
                        {filteredReservations.map((reservation) => (
                          <label key={reservation.id} className="px-3 py-1.5 flex items-center gap-2 hover:bg-neutral-50 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="rounded border-neutral-300 w-3 h-3" 
                              checked={reservationsFilter.includes(reservation.id)}
                              onChange={() => handleReservationToggle(reservation.id)}
                            />
                            <div className="flex-1 min-w-0">
                              <span className="text-xs text-neutral-900 block truncate">{reservation.guestName}</span>
                              <span className="text-[10px] text-neutral-500">{reservation.id}</span>
                            </div>
                          </label>
                        ))}
                        {filteredReservations.length === 0 && (
                          <div className="px-3 py-2 text-xs text-neutral-500">No reservations found</div>
                        )}
                      </>
                    )}
                    {activeSubmenu === 'apartment' && (
                      <>
                        <div className="px-3 py-2 border-b border-neutral-100 sticky top-0 bg-white">
                          <div className="relative">
                            <svg
                              className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-neutral-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                              />
                            </svg>
                            <input
                              type="text"
                              placeholder="Filter..."
                              value={apartmentSearch}
                              onChange={(e) => setApartmentSearch(e.target.value)}
                              className="w-full pl-7 pr-2 py-1 text-xs border border-neutral-200 rounded focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>
                        {filteredApartments.map((listing) => (
                          <label key={listing.id} className="px-3 py-1.5 flex items-center gap-2 hover:bg-neutral-50 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="rounded border-neutral-300 w-3 h-3" 
                              checked={apartmentsFilter.includes(listing.sku)}
                              onChange={() => handleApartmentToggle(listing.sku)}
                            />
                            <div className="flex-1 min-w-0">
                              <span className="text-xs text-neutral-900 block truncate">{listing.name}</span>
                              <span className="text-[10px] text-neutral-500">{listing.sku}</span>
                            </div>
                          </label>
                        ))}
                        {filteredApartments.length === 0 && (
                          <div className="px-3 py-2 text-xs text-neutral-500">No apartments found</div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search cases..."
            value={searchFilter}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900"
          />
        </div>
      </div>

      {/* Filter Tags */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap mt-3">
          {getFilterTags().map((tag, index) => (
            <div
              key={`${tag.type}-${tag.value}-${index}`}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs text-neutral-700 bg-neutral-50 border border-neutral-200 rounded-full"
            >
              <span>{tag.label}</span>
              <button
                onClick={() => {
                  if (tag.type === 'status') {
                    removeStatusFilter(tag.value as Status);
                  } else if (tag.type === 'team') {
                    removeTeamFilter(tag.value as TeamType);
                  } else if (tag.type === 'date') {
                    removeDateFilter();
                  } else if (tag.type === 'reservation') {
                    removeReservationFilter(tag.value);
                  } else if (tag.type === 'apartment') {
                    removeApartmentFilter(tag.value);
                  }
                }}
                className="hover:text-neutral-900"
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          <button
            onClick={clearAllFilters}
            className="text-xs text-neutral-500 hover:text-neutral-900 px-2"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}

