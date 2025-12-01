import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GuestReservationsModal } from '@/components/shared/GuestReservationsModal';
import { AIChat } from '@/components/shared/AIChat';
import { ConversationHistory } from '@/components/shared/ConversationHistory';
import { NotesSection } from '@/components/shared/NotesSection';
import { CreateCaseModal } from '@/features/cases/components/CreateCaseModal';
import { mockReservations } from '@/data/mockReservations';
import { mockProperties } from '@/data/mockProperties';
import { mockCases } from '@/data/mockCases';
import { mockConversations } from '@/data/mockConversations';
import { mockNotes } from '@/data/mockNotes';
import type { Reservation } from '@/types/reservation';

interface ReservationTab {
  id: string;
  guestName: string;
  reservation: Reservation;
}

type ReservationStatus = 'CONFIRMED' | 'IN_HOUSE' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED';

export function Reservations() {
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('search');
  const [searchType, setSearchType] = useState('Guest Name');
  // const [searchMode, setSearchMode] = useState('Normal');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  // const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedGuestReservations, setSelectedGuestReservations] = useState<Reservation[]>([]);
  const [selectedGuestName, setSelectedGuestName] = useState('');
  const [openTabs, setOpenTabs] = useState<ReservationTab[]>([]);
  const [isCreateCaseModalOpen, setIsCreateCaseModalOpen] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const typeDropdownRef = useRef<HTMLDivElement>(null);
  const modeDropdownRef = useRef<HTMLDivElement>(null);
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<ReservationStatus[]>([]);
  const [dateRangeFilter, setDateRangeFilter] = useState<string>('ALL');
  const [quickFilter, setQuickFilter] = useState<string | null>('check-ins needing action');
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set(['check-ins needing action']));

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target as Node)) {
        setShowTypeDropdown(false);
      }
      // if (modeDropdownRef.current && !modeDropdownRef.current.contains(event.target as Node)) {
      //   setShowModeDropdown(false);
      // }
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setShowFilterDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    // Search by guest name
    if (searchType === 'Guest Name') {
      const reservations = mockReservations.filter(
        (res) => res.guestName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      if (reservations.length > 0) {
        setSelectedGuestReservations(reservations);
        setSelectedGuestName(reservations[0].guestName);
        setShowModal(true);
      }
    }
    // Add other search types as needed
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSelectReservation = (reservation: Reservation) => {
    // Create a new tab for this reservation
    const newTab: ReservationTab = {
      id: reservation.id,
      guestName: reservation.guestName,
      reservation: reservation,
    };
    
    // Check if tab already exists
    const existingTab = openTabs.find(tab => tab.id === reservation.id);
    if (existingTab) {
      // Just switch to existing tab
      setActiveTab(reservation.id);
    } else {
      // Add new tab
      setOpenTabs([...openTabs, newTab]);
      setActiveTab(reservation.id);
    }
    
    setShowModal(false);
  };

  const handleCloseTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedTabs = openTabs.filter(tab => tab.id !== tabId);
    setOpenTabs(updatedTabs);
    
    // If closing active tab, switch to search or first available tab
    if (activeTab === tabId) {
      if (updatedTabs.length > 0) {
        setActiveTab(updatedTabs[0].id);
      } else {
        setActiveTab('search');
      }
    }
  };

  const allTabs = [
    { id: 'search', label: 'Search', isCloseable: false, isFixed: true },
    { id: 'filter', label: 'Filter', isCloseable: false, isFixed: true },
    ...openTabs.map(tab => ({
      id: tab.id,
      label: tab.guestName,
      isCloseable: true,
      isFixed: false,
    })),
  ];

  // Helper functions for filters
  const removeStatusFilter = (status: ReservationStatus) => {
    setStatusFilter(statusFilter.filter(s => s !== status));
  };

  const clearAllFilters = () => {
    setStatusFilter([]);
    setDateRangeFilter('ALL');
    setQuickFilter(null);
    setSelectedFilters(new Set());
  };

  const toggleFilter = (filterValue: string) => {
    const newFilters = new Set(selectedFilters);
    if (newFilters.has(filterValue)) {
      newFilters.delete(filterValue);
    } else {
      newFilters.add(filterValue);
    }
    setSelectedFilters(newFilters);
    
    // Set quickFilter to the last selected filter or null if none selected
    if (newFilters.size > 0) {
      setQuickFilter(Array.from(newFilters)[newFilters.size - 1]);
    } else {
      setQuickFilter(null);
    }
  };

  const hasActiveFilters = statusFilter.length > 0 || dateRangeFilter !== 'ALL' || quickFilter !== null;

  const getFilterTags = () => {
    const tags: Array<{ type: 'status' | 'date' | 'quick'; value: string; label: string }> = [];
    
    statusFilter.forEach(status => {
      const label = status.replace('_', ' ');
      tags.push({ type: 'status', value: status, label: `Status: ${label}` });
    });
    
    if (dateRangeFilter !== 'ALL') {
      tags.push({ type: 'date', value: dateRangeFilter, label: `Date: ${dateRangeFilter}` });
    }
    
    selectedFilters.forEach(filter => {
      tags.push({ type: 'quick', value: filter, label: `Status: ${filter.toUpperCase()}` });
    });
    
    return tags;
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className={`w-full px-8 pt-6 ${activeTab !== 'search' && activeTab !== 'filter' ? 'mr-[420px]' : ''}`}>
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-xl font-normal text-neutral-900">Reservations</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Manage and track all guest reservations
          </p>
        </div>
        
        {/* Tabs Navigation */}
        <div className="border-b border-neutral-200 mb-8">
          <div className="flex gap-2 overflow-x-auto">
            {allTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-sm font-normal transition-colors relative flex items-center gap-2 whitespace-nowrap ${
                  tab.isFixed 
                    ? 'bg-neutral-100 rounded-t-md px-6 py-2 justify-center' 
                    : 'pb-2 px-3'
                } ${
                  activeTab === tab.id
                    ? 'text-neutral-900 font-medium'
                    : 'text-neutral-500 hover:text-neutral-600'
                }`}
              >
                {tab.label}
                {tab.isCloseable && (
                  <button
                    onClick={(e) => handleCloseTab(tab.id, e)}
                    className="ml-1 hover:bg-neutral-200 rounded p-0.5 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Search Content */}
        {activeTab === 'search' && (
          <div className="w-full max-w-xl mx-auto mt-32">
            {/* Search Box Container */}
            <div className="border border-neutral-200 rounded-xl bg-white p-4 shadow-sm">
              <textarea
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Search reservations by ${searchType}`}
                rows={1}
                className="w-full text-sm text-neutral-700 placeholder:text-neutral-400 border-0 focus:outline-none resize-none min-h-[32px]"
              />
              
              {/* Bottom Controls */}
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-4">
                  {/* Search Type Dropdown */}
                  <div className="relative" ref={typeDropdownRef}>
                    <button
                      onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                      className="flex items-center gap-2 text-xs text-neutral-600 hover:text-neutral-900 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span>{searchType}</span>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {showTypeDropdown && (
                      <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-10">
                        {['Guest Name', 'Reservation ID', 'Property Address', 'Arrival Date'].map((type) => (
                          <button
                            key={type}
                            onClick={() => {
                              setSearchType(type);
                              setShowTypeDropdown(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-xs transition-colors ${
                              searchType === type
                                ? 'bg-neutral-100 text-neutral-900 font-medium'
                                : 'text-neutral-600 hover:bg-neutral-50'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Send Button */}
                <button 
                  onClick={handleSearch}
                  className="w-8 h-8 rounded-full bg-neutral-200 hover:bg-neutral-300 flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filter Content */}
        {activeTab === 'filter' && (
          <div className="w-full">
            {/* Filter Tags Section */}
            <div className="bg-white rounded-lg p-4 shadow-sm mb-6 max-w-5xl mx-auto">
              <div className="flex items-center gap-3 flex-wrap">
                {/* Filter Icon and Text with Dropdown */}
                <div className="relative" ref={filterDropdownRef}>
                  <button
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    className="flex items-center gap-2 hover:bg-neutral-50 px-2 py-1 rounded transition-colors"
                  >
                    <svg
                      className="h-4 w-4 text-neutral-500"
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
                    <span className="text-sm font-medium text-neutral-700">Filter</span>
                  </button>

                  {/* Filter Dropdown */}
                  {showFilterDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 z-20">
                      <button
                        onClick={() => toggleFilter('unpaid reservations')}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                      >
                        <div className="flex items-center justify-center w-4 h-4 border border-neutral-300 rounded bg-white flex-shrink-0">
                          {selectedFilters.has('unpaid reservations') && (
                            <svg className="w-3 h-3 text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className="flex-1 text-left">Unpaid reservations</span>
                      </button>
                      <button
                        onClick={() => toggleFilter('arrivals today')}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                      >
                        <div className="flex items-center justify-center w-4 h-4 border border-neutral-300 rounded bg-white flex-shrink-0">
                          {selectedFilters.has('arrivals today') && (
                            <svg className="w-3 h-3 text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className="flex-1 text-left">Arrivals today</span>
                      </button>
                      <button
                        onClick={() => toggleFilter('check-ins needing action')}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                      >
                        <div className="flex items-center justify-center w-4 h-4 border border-neutral-300 rounded bg-white flex-shrink-0">
                          {selectedFilters.has('check-ins needing action') && (
                            <svg className="w-3 h-3 text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className="flex-1 text-left">Check-ins needing action</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Filter Tags */}
                {getFilterTags().map((tag, index) => (
                  <div
                    key={`${tag.type}-${tag.value}-${index}`}
                    className="inline-flex items-center gap-2 px-2.5 py-1 text-xs text-neutral-700 bg-neutral-100 border border-neutral-200 rounded-full"
                  >
                    <span>{tag.label}</span>
                    <button
                      onClick={() => {
                        if (tag.type === 'status') {
                          removeStatusFilter(tag.value as ReservationStatus);
                        } else if (tag.type === 'date') {
                          setDateRangeFilter('ALL');
                        } else if (tag.type === 'quick') {
                          toggleFilter(tag.value);
                        }
                      }}
                      className="hover:text-neutral-900 transition-colors"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}

                {/* Clear All */}
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors px-2"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-3 max-w-5xl mx-auto">
              <p className="text-xs text-neutral-400">
                Showing {mockReservations.length} of {mockReservations.length} reservations
              </p>
            </div>

            {/* Reservations List Section */}
            <div className="bg-white rounded-lg overflow-hidden max-w-5xl mx-auto">
              {/* Column Headers */}
              <div className="grid grid-cols-[2.5fr,2fr,1.5fr,1fr,auto] gap-8 px-6 py-3">
                <div className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                  Reservation ID
                </div>
                <div className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                  Guest Name
                </div>
                <div className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                  Arrival Date
                </div>
                <div className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                  Paid Status
                </div>
                <div className="w-6"></div>
              </div>

              {/* Reservation Rows */}
              {mockReservations.map((reservation) => {
                const arrivalDate = new Date(reservation.checkIn).toLocaleDateString('en-US', {
                  month: '2-digit',
                  day: '2-digit',
                  year: 'numeric',
                });

                return (
                  <div
                    key={reservation.id}
                    onClick={() => handleSelectReservation(reservation)}
                    className="grid grid-cols-[2.5fr,2fr,1.5fr,1fr,auto] gap-8 px-6 py-4 border-t border-neutral-100 hover:bg-neutral-50 cursor-pointer transition-colors items-center group"
                  >
                    {/* Reservation ID */}
                    <div className="text-sm text-neutral-600">
                      {reservation.id}
                    </div>

                    {/* Guest Name */}
                    <div className="text-sm text-neutral-900 font-normal">
                      {reservation.guestName}
                    </div>

                    {/* Arrival Date */}
                    <div className="text-sm text-neutral-600">
                      {arrivalDate}
                    </div>

                    {/* Paid Status */}
                    <div className="text-sm font-medium text-green-600">
                      Paid
                    </div>

                    {/* Arrow */}
                    <div className="flex items-center justify-end">
                      <svg
                        className="w-5 h-5 text-neutral-300 group-hover:text-neutral-400 transition-colors"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Reservation Tab Content - Dynamically rendered for each open tab */}
        {openTabs.map(tab => tab.id).includes(activeTab) && (() => {
          const currentTab = openTabs.find(tab => tab.id === activeTab);
          if (!currentTab) return null;
          
          const reservation = currentTab.reservation;
          const property = mockProperties.find(p => p.id === reservation.propertyId);
          const checkInDate = new Date(reservation.checkIn);
          const checkOutDate = new Date(reservation.checkOut);
          
          const formatDateTime = (date: Date) => {
            return date.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: '2-digit',
            });
          };

          // const formatTime = (date: Date) => {
          //   return date.toLocaleTimeString('en-US', {
          //     hour: 'numeric',
          //     minute: '2-digit',
          //     hour12: true,
          //   }).replace(' ', '').toLowerCase();
          // };
          
          return (
          <div key={currentTab.id} className="w-full max-w-[50.16rem]">
            <div className="grid grid-cols-2 gap-6">
                    {/* Left Section - Reservation Details */}
                    <div className="bg-white rounded-lg p-6">
                      <h2 className="text-base font-semibold text-neutral-900 mb-4">Reservation Details</h2>
                      
                      <div className="space-y-3">
                        {/* Reservation ID */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-neutral-500">Reservation ID:</span>
                            <span className="text-xs font-medium text-neutral-900">{reservation.id}</span>
                          </div>
                          <button className="text-neutral-400 hover:text-neutral-600">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>

                        {/* Hostaway ID */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-neutral-500">Hostaway ID:</span>
                          <span className="text-xs font-medium text-neutral-900">{reservation.propertyId.split('_').slice(0, 3).join('_')}</span>
                          <a
                            href={`https://dashboard.hostaway.com/reservations/${reservation.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neutral-400 hover:text-neutral-600 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        </div>

                        {/* Guest Name */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-neutral-500">Full Name:</span>
                          <span className="text-xs font-medium text-neutral-900">{reservation.guestName}</span>
                        </div>

                        {/* Phone */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-neutral-500">Phone Number:</span>
                          <span className="text-xs font-medium text-neutral-900">{reservation.guestPhone || 'N/A'}</span>
                        </div>

                        {/* Email */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-neutral-500">Email:</span>
                          <span className="text-xs font-medium text-neutral-900">{reservation.guestEmail}</span>
                        </div>

                        {/* Check-in and Check-out */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-neutral-500">Check-in - Check-out:</span>
                          <span className="text-xs font-medium text-neutral-900">
                            {formatDateTime(checkInDate)} - {formatDateTime(checkOutDate)}
                          </span>
                        </div>

                        {/* Total Value */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-neutral-500">Total Value:</span>
                          <span className="text-xs font-medium text-neutral-900">{reservation.totalValue.toFixed(2)} EUR</span>
                          <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-neutral-500 text-white">
                            Paid
                          </span>
                          <a 
                            href="#" 
                            className="inline-flex items-center text-neutral-400 hover:text-neutral-600 transition-colors"
                            onClick={(e) => {
                              e.preventDefault();
                              // TODO: Navigate to external reservation page
                              console.log('Navigate to external reservation page:', reservation.id);
                            }}
                            title="Open in external page"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Unit Details */}
                    <div className="bg-white rounded-lg p-6">
                      <h2 className="text-base font-semibold text-neutral-900 mb-4">Property Details</h2>
                      
                      <div className="space-y-3">
                        {/* Unit ID */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-neutral-500">Listing Unit:</span>
                          <span className="text-xs font-medium text-neutral-900">{property?.id || 'N/A'}</span>
                        </div>

                        {/* Address */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-neutral-500">Address:</span>
                          <span className="text-xs font-medium text-neutral-900">{property?.address || 'N/A'}</span>
                        </div>

                        {/* Property Type */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-neutral-500">Property Type:</span>
                          <span className="text-xs font-medium text-neutral-900">Single Unit</span>
                        </div>

                        {/* Property Handbook */}
                        {property?.handbookUrl && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-neutral-500">Property Handbook:</span>
                            <a
                              href={property.handbookUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-700 hover:underline"
                            >
                              View Handbook →
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Summary Section */}
                  {(() => {
                    // Determine guest journey based on reservation status
                    const getGuestJourney = (status: string) => {
                      switch (status) {
                        case 'CONFIRMED':
                          return 'Pre-check-in';
                        case 'IN_HOUSE':
                        case 'CHECKED_IN':
                          return 'Check-in';
                        case 'CHECKED_OUT':
                          return 'Post-check-out';
                        case 'PENDING':
                          return 'Pre-check-out';
                        default:
                          return 'Pre-check-in';
                      }
                    };

                    const guestJourney = getGuestJourney(reservation.status);
                    
                    return (
                      <div className="mt-6 bg-white rounded-lg p-6">
                        <h2 className="text-base font-semibold text-neutral-900 mb-4">Guest Journey</h2>
                        
                        {/* Guest Journey */}
                        <div className="mb-4">
                          {/* Journey Timeline */}
                          <div className="flex items-center justify-center max-w-3xl mx-auto relative py-4">
                            {/* Pre-check-in */}
                            <div className={`relative z-10 w-32 h-9 flex items-center justify-center rounded-md text-xs font-medium transition-colors ${
                              guestJourney === 'Pre-check-in'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-neutral-50 text-neutral-500 border border-neutral-200 shadow-sm'
                            }`}>
                              Pre-check-in
                            </div>
                            
                            {/* Connector 1 */}
                            <div className="w-12 h-[2px] bg-neutral-300" />
                            
                            {/* Check-in */}
                            <div className={`relative z-10 w-32 h-9 flex items-center justify-center rounded-md text-xs font-medium transition-colors ${
                              guestJourney === 'Check-in'
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : 'bg-neutral-50 text-neutral-500 border border-neutral-200 shadow-sm'
                            }`}>
                              Check-in
                            </div>
                            
                            {/* Connector 2 */}
                            <div className="w-12 h-[2px] bg-neutral-300" />
                            
                            {/* Pre-check-out */}
                            <div className={`relative z-10 w-32 h-9 flex items-center justify-center rounded-md text-xs font-medium transition-colors ${
                              guestJourney === 'Pre-check-out'
                                ? 'bg-orange-50 text-orange-700 border border-orange-200'
                                : 'bg-neutral-50 text-neutral-500 border border-neutral-200 shadow-sm'
                            }`}>
                              Pre-check-out
                            </div>
                            
                            {/* Connector 3 */}
                            <div className="w-12 h-[2px] bg-neutral-300" />
                            
                            {/* Post-check-out */}
                            <div className={`relative z-10 w-32 h-9 flex items-center justify-center rounded-md text-xs font-medium transition-colors ${
                              guestJourney === 'Post-check-out'
                                ? 'bg-neutral-100 text-neutral-700 border border-neutral-300'
                                : 'bg-neutral-50 text-neutral-500 border border-neutral-200 shadow-sm'
                            }`}>
                              Post-check-out
                            </div>
                          </div>
                          
                          {/* Summary Bullet Points */}
                          <ul className="mt-4 space-y-0.5 list-none text-sm text-neutral-600 pl-6">
                            <li className="before:content-['-'] before:mr-2">Chen requested early check-in due to 8 AM flight arrival; approved for 10 AM at no charge.</li>
                            <li className="before:content-['-'] before:mr-2">Payment issue with card validation; Chen confirms card update and team retries payment.</li>
                            <li className="before:content-['-'] before:mr-2">Chen follows up to confirm payment status and resolution of the validation issue.</li>
                          </ul>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Tickets Section */}
                  {(() => {
                    const relatedCases = mockCases.filter(c => c.reservationId === reservation.id);
                    
                    const formatDate = (dateString: string) => {
                      return new Date(dateString).toLocaleDateString('en-US', {
                        month: '2-digit',
                        day: '2-digit',
                        year: 'numeric',
                      });
                    };
                    
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
                      <div className="mt-6 bg-white rounded-lg pt-6 px-6 pb-2">
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-base font-semibold text-neutral-900">Tickets</h2>
                          <button 
                            onClick={() => navigate('/cases')}
                            className="text-xs text-neutral-500 hover:text-neutral-700 transition-colors"
                          >
                            View history
                          </button>
                        </div>
                        
                        {/* Scrollable ticket list - Fixed height to show ~5 tickets */}
                        <div className="max-h-[220px] overflow-y-auto border-b border-neutral-100">
                          {relatedCases.length > 0 ? (
                            relatedCases.map((ticket) => (
                              <div
                                key={ticket.id}
                                onClick={() => navigate(`/cases/${ticket.id}`)}
                                className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50 cursor-pointer transition-colors"
                              >
                                {/* Left section: ID and Title */}
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <span className="text-xs text-neutral-400 font-medium whitespace-nowrap">
                                    {ticket.id}
                                  </span>
                                  <span className="text-xs text-neutral-900 font-normal truncate flex-1">
                                    {ticket.title}
                                  </span>
                                </div>

                                {/* Right section: Status and Date */}
                                <div className="flex items-center gap-4 ml-4">
                                  <span className={`inline-flex px-2.5 py-1 text-xs rounded border ${getStatusColor(ticket.status)}`}>
                                    {formatStatus(ticket.status)}
                                  </span>
                                  <span className="text-xs text-neutral-500 whitespace-nowrap">
                                    {formatDate(ticket.createdAt)}
                                  </span>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-neutral-500 py-4 text-center">
                              No tickets found for this reservation
                            </div>
                          )}
                        </div>

                        {/* Add Case Button - Fixed at bottom */}
                        <button 
                          onClick={() => setIsCreateCaseModalOpen(true)}
                          className="w-full flex items-center justify-center gap-2 pt-3 pb-1 text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          <span>Add Case</span>
                        </button>
                      </div>
                    );
                  })()}

                  {/* Past Conversations Section */}
                  {(() => {
                    const conversations = mockConversations.filter(c => c.reservationId === reservation.id);
                    // Extract conversation tags
                    const conversationTags = new Set<string>();
                    conversations.forEach(thread => {
                      thread.messages.forEach(message => {
                        if (message.tag) {
                          conversationTags.add(message.tag);
                        }
                      });
                    });
                    return <ConversationHistory conversations={conversations} conversationTags={conversationTags} />;
                  })()}

                  {/* Notes Section */}
                  {(() => {
                    const notes = mockNotes.filter(n => n.reservationId === reservation.id);
                    return <div className="mb-8"><NotesSection reservationId={reservation.id} notes={notes} /></div>;
                  })()}
                </div>
          );
        })()}
      </div>

      {/* Guest Reservations Modal */}
      <GuestReservationsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        reservations={selectedGuestReservations}
        guestName={selectedGuestName}
        onSelectReservation={handleSelectReservation}
      />

      {/* Create Case Modal */}
      <CreateCaseModal
        open={isCreateCaseModalOpen}
        onOpenChange={setIsCreateCaseModalOpen}
      />

      {/* Fixed Right AI Chat Panel - Only show when viewing a reservation */}
      {activeTab !== 'search' && activeTab !== 'filter' && (() => {
        const currentTab = openTabs.find(tab => tab.id === activeTab);
        return (
          <div className="fixed top-0 right-0 bottom-0 w-[420px] z-30 border-l border-neutral-200 bg-white">
            <AIChat context={activeTab} guestName={currentTab?.guestName} />
          </div>
        );
      })()}
    </div>
  );
}

