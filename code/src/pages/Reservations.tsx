import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GuestReservationsModal } from '@/components/shared/GuestReservationsModal';
import { AIChat } from '@/components/shared/AIChat';
import { ConversationHistory } from '@/components/shared/ConversationHistory';
import { NotesSection } from '@/components/shared/NotesSection';
import { CreateCaseModal } from '@/features/cases/components/CreateCaseModal';
import { mockReservations } from '@/data/mockReservations';
import { mockProperties } from '@/data/mockProperties';
import { mockListings } from '@/data/mockListings';
import { mockCases } from '@/data/mockCases';
import { mockConversations } from '@/data/mockConversations';
import { mockNotes } from '@/data/mockNotes';
import type { Reservation } from '@/types/reservation';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';

interface ReservationTab {
  id: string;
  guestName: string;
  reservation: Reservation;
}

type ReservationStatus = 'CONFIRMED' | 'IN_HOUSE' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED';

export function Reservations() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    const saved = sessionStorage.getItem('reservations-activeTab');
    return saved || 'search';
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedGuestReservations] = useState<Reservation[]>([]);
  const [selectedGuestName] = useState('');
  const [openTabs, setOpenTabs] = useState<ReservationTab[]>(() => {
    const saved = sessionStorage.getItem('reservations-openTabs');
    if (saved) {
      try {
        const savedIds = JSON.parse(saved) as string[];
        // Restore full reservation data from mockReservations
        return savedIds
          .map(id => {
            const reservation = mockReservations.find(r => r.id === id);
            if (reservation) {
              return {
                id: reservation.id,
                guestName: reservation.guestName,
                reservation: reservation,
              };
            }
            return null;
          })
          .filter((tab): tab is ReservationTab => tab !== null);
      } catch {
        return [];
      }
    }
    return [];
  });
  const [isCreateCaseModalOpen, setIsCreateCaseModalOpen] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [isChatPanelVisible, setIsChatPanelVisible] = useState(true);
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<ReservationStatus[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set());

  // Persist openTabs to sessionStorage (only save IDs)
  useEffect(() => {
    const tabIds = openTabs.map(tab => tab.id);
    sessionStorage.setItem('reservations-openTabs', JSON.stringify(tabIds));
  }, [openTabs]);

  // Persist activeTab to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('reservations-activeTab', activeTab);
  }, [activeTab]);

  // Handle URL query parameter for direct reservation navigation
  useEffect(() => {
    const reservationId = searchParams.get('id');
    if (reservationId) {
      const reservation = mockReservations.find(r => r.id === reservationId);
      if (reservation) {
        const existingTab = openTabs.find(tab => tab.id === reservation.id);
        if (!existingTab) {
          // Add new tab
          const newTab: ReservationTab = {
            id: reservation.id,
            guestName: reservation.guestName,
            reservation: reservation,
          };
          setOpenTabs(prev => [...prev, newTab]);
        }
        // Set as active tab
        setActiveTab(reservation.id);
        // Clear the query parameter
        setSearchParams({});
      }
    }
  }, [searchParams, openTabs, setSearchParams]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setShowFilterDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    // Mark search as submitted to show results immediately
    setSearchSubmitted(true);
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
    ...openTabs.map(tab => ({
      id: tab.id,
      label: tab.guestName,
      isCloseable: true,
      isFixed: false,
    })),
  ];

  // Helper functions for filters
  const clearAllFilters = () => {
    setStatusFilter([]);
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
  };

  // Filter reservations based on selected filters and search
  const getFilteredReservations = () => {
    const hasSearch = searchQuery.trim().length >= 5 || (searchSubmitted && searchQuery.trim().length > 0);
    
    // If no filters are selected and no valid search, return empty array
    if (selectedFilters.size === 0 && statusFilter.length === 0 && !hasSearch) {
      return [];
    }

    let filtered = [...mockReservations];

    // Apply search query if 5 or more characters OR if search was submitted with Enter
    if (hasSearch) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r => {
        // Search across multiple fields
        return (
          r.guestName.toLowerCase().includes(query) ||
          r.id.toLowerCase().includes(query) ||
          r.propertyId.toLowerCase().includes(query) ||
          r.guestEmail.toLowerCase().includes(query)
        );
      });
    }

    // Apply quick filters
    if (selectedFilters.has('unpaid reservations')) {
      filtered = filtered.filter(r => 
        r.paidStatus === 'Pending' || r.paidStatus === 'Not Paid'
      );
    }

    if (selectedFilters.has('arrivals today')) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filtered = filtered.filter(r => {
        const checkIn = new Date(r.checkIn);
        checkIn.setHours(0, 0, 0, 0);
        return checkIn.getTime() === today.getTime();
      });
    }

    if (selectedFilters.has('check-ins needing action')) {
      // For now, keeping all reservations for this filter
      // You can add specific logic here if needed
      filtered = filtered;
    }

    // Apply status filters
    if (statusFilter.length > 0) {
      filtered = filtered.filter(r => statusFilter.includes(r.status));
    }

    return filtered;
  };

  const filteredReservations = getFilteredReservations();

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className={`w-full px-8 pt-6 ${activeTab !== 'search' && isChatPanelVisible ? 'mr-[420px]' : ''} transition-all duration-300`}>
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
          <div className="w-full">
            {/* Filter and Search Section */}
            <div className="bg-white rounded-lg mb-6 max-w-5xl mx-auto">
              <div className="flex items-center gap-4 p-4">
                {/* Filter Button with Dropdown */}
                <div className="relative" ref={filterDropdownRef}>
                  <button
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    className="flex items-center gap-2 hover:bg-neutral-50 px-3 py-2 rounded transition-colors"
                  >
                    <svg
                      className="h-4 w-4 text-neutral-600"
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
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-neutral-200 z-20">
                      <div className="py-1">
                        {/* Unpaid Reservations */}
                        <button
                          onClick={() => toggleFilter('unpaid reservations')}
                          className={`w-full px-3 py-1.5 flex items-center justify-between hover:bg-neutral-50 transition-colors text-left ${
                            selectedFilters.has('unpaid reservations') ? 'bg-neutral-50' : ''
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <svg className="h-4 w-4 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-xs text-neutral-900">Unpaid reservations</span>
                          </div>
                          <svg className="h-3 w-3 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>

                        {/* Arrivals Today */}
                        <button
                          onClick={() => toggleFilter('arrivals today')}
                          className={`w-full px-3 py-1.5 flex items-center justify-between hover:bg-neutral-50 transition-colors text-left ${
                            selectedFilters.has('arrivals today') ? 'bg-neutral-50' : ''
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <svg className="h-4 w-4 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-xs text-neutral-900">Arrivals today</span>
                          </div>
                          <svg className="h-3 w-3 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>

                        {/* Check-ins Needing Action */}
                        <button
                          onClick={() => toggleFilter('check-ins needing action')}
                          className={`w-full px-3 py-1.5 flex items-center justify-between hover:bg-neutral-50 transition-colors text-left ${
                            selectedFilters.has('check-ins needing action') ? 'bg-neutral-50' : ''
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <svg className="h-4 w-4 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span className="text-xs text-neutral-900">Check-ins needing action</span>
                          </div>
                          <svg className="h-3 w-3 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Search Input */}
                <div className="flex-1 relative">
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400"
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
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      // Reset search submitted state when user types
                      if (searchSubmitted && e.target.value.trim().length < 5) {
                        setSearchSubmitted(false);
                      }
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder="Search reservations..."
                    autoComplete="off"
                    spellCheck="false"
                    className="w-full pl-10 pr-4 py-2 text-sm text-neutral-700 placeholder:text-neutral-400 bg-white border border-neutral-200 rounded focus:outline-none focus:border-neutral-300"
                  />
                </div>
              </div>

              {/* Active Filters Section */}
              {selectedFilters.size > 0 && (
                <div className="flex items-center gap-3 px-4 pb-4 flex-wrap">
                  {Array.from(selectedFilters).map((filter) => (
                    <div
                      key={filter}
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-neutral-700 bg-neutral-100 rounded-full"
                    >
                      <span className="capitalize">{filter}</span>
                      <button
                        onClick={() => toggleFilter(filter)}
                        className="hover:text-neutral-900 transition-colors"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  
                  {/* Clear All Button */}
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {/* Results Count */}
            <div className="mb-3 max-w-5xl mx-auto">
              <p className="text-sm text-neutral-400">
                Showing {filteredReservations.length} reservations
              </p>
            </div>

            {/* Reservations Table */}
            <div className="bg-white rounded-lg overflow-hidden max-w-5xl mx-auto">
              {/* Column Headers */}
              <div className="grid grid-cols-[minmax(140px,1.5fr),minmax(140px,1.5fr),minmax(140px,1.5fr),minmax(180px,2fr),minmax(120px,1fr),minmax(100px,1fr),auto] gap-6 px-6 py-3 border-b border-neutral-100">
                <div className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                  Reservation ID
                </div>
                <div className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                  Guest Name
                </div>
                <div className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                  Guest Journey
                </div>
                <div className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                  Property Street
                </div>
                <div className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                  Arrival Date
                </div>
                <div className="text-xs font-medium text-neutral-400 uppercase tracking-wide text-right">
                  Paid Status
                </div>
                <div className="w-6"></div>
              </div>

              {/* Empty State */}
              {filteredReservations.length === 0 && (
                <div className="flex items-center justify-center py-32">
                  <p className="text-sm text-neutral-400">
                    The search result will be displayed here
                  </p>
                </div>
              )}

              {/* Reservation Rows */}
              {filteredReservations.map((reservation) => {
                const arrivalDate = new Date(reservation.checkIn).toLocaleDateString('en-US', {
                  month: '2-digit',
                  day: '2-digit',
                  year: 'numeric',
                });

                // Determine guest journey based on reservation status
                const getGuestJourney = (status: string): 'Booking' | 'Pre Check-in' | 'Check-in' | 'During Stay' | 'Check-out' | 'Post Check-out' => {
                  switch (status) {
                    case 'CONFIRMED':
                      return 'Pre Check-in';
                    case 'IN_HOUSE':
                    case 'CHECKED_IN':
                      return 'Check-in';
                    case 'CHECKING_OUT':
                      return 'Check-out';
                    case 'CHECKED_OUT':
                      return 'Post Check-out';
                    case 'PENDING':
                      return 'During Stay';
                    default:
                      return 'Booking';
                  }
                };

                const guestJourney = getGuestJourney(reservation.status);

                // Get property and extract street address
                const property = mockProperties.find(p => p.id === reservation.propertyId);
                const propertyStreet = property?.address.split(',')[0] || 'N/A';

                return (
                  <div
                    key={reservation.id}
                    onClick={() => handleSelectReservation(reservation)}
                    className="grid grid-cols-[minmax(140px,1.5fr),minmax(140px,1.5fr),minmax(140px,1.5fr),minmax(180px,2fr),minmax(120px,1fr),minmax(100px,1fr),auto] gap-6 px-6 py-4 border-b border-neutral-100 hover:bg-neutral-50 cursor-pointer transition-colors items-center group last:border-b-0"
                  >
                    {/* Reservation ID */}
                    <div className="text-sm text-neutral-600 font-normal">
                      {reservation.id}
                    </div>

                    {/* Guest Name */}
                    <div className="text-sm text-neutral-900 font-normal">
                      {reservation.guestName}
                    </div>

                    {/* Guest Journey */}
                    <div className="text-sm text-neutral-600">
                      {guestJourney}
                    </div>

                    {/* Property Street */}
                    <div className="text-sm text-neutral-600">
                      {propertyStreet}
                    </div>

                    {/* Arrival Date */}
                    <div className="text-sm text-neutral-600">
                      {arrivalDate}
                    </div>

                    {/* Paid Status */}
                    <div className="text-right">
                      <span className={`text-sm font-medium ${
                        reservation.paidStatus === 'Paid' 
                          ? 'text-green-600' 
                          : reservation.paidStatus === 'Pending'
                          ? 'text-amber-600'
                          : 'text-red-600'
                      }`}>
                        {reservation.paidStatus || 'Paid'}
                      </span>
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
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-neutral-500">Reservation ID:</span>
                          <span className="text-xs font-medium text-neutral-900">{reservation.id}</span>
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
                          <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                            reservation.paidStatus === 'Paid'
                              ? 'bg-green-600 text-white'
                              : reservation.paidStatus === 'Pending'
                              ? 'bg-amber-500 text-white'
                              : 'bg-red-600 text-white'
                          }`}>
                            {reservation.paidStatus || 'Paid'}
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
                          <span className="text-xs text-neutral-500">Unit SKU:</span>
                          {(() => {
                            // Find the listing that matches this property ID (SKU)
                            const listing = mockListings.find(l => l.sku === reservation.propertyId);
                            if (listing) {
                              return (
                                <a 
                                  href={`/listings-2/${listing.id}`}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    navigate(`/listings-2/${listing.id}`);
                                  }}
                                  className="text-xs font-medium text-neutral-900 underline hover:text-neutral-700 transition-colors cursor-pointer"
                                >
                                  {reservation.propertyId}
                                </a>
                              );
                            }
                            return (
                              <span className="text-xs font-medium text-neutral-900">
                                {reservation.propertyId}
                              </span>
                            );
                          })()}
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

                        {/* OTA Listing */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-neutral-500">OTA Listing:</span>
                          <span className="text-xs font-medium text-neutral-900">Booking.com</span>
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
                    const getGuestJourney = (status: string): 'Booking' | 'Pre Check-in' | 'Check-in' | 'During Stay' | 'Check-out' | 'Post Check-out' => {
                      switch (status) {
                        case 'CONFIRMED':
                          return 'Pre Check-in';
                        case 'IN_HOUSE':
                        case 'CHECKED_IN':
                          return 'Check-in';
                        case 'CHECKING_OUT':
                          return 'Check-out';
                        case 'CHECKED_OUT':
                          return 'Post Check-out';
                        case 'PENDING':
                          return 'During Stay';
                        default:
                          return 'Booking';
                      }
                    };

                    const guestJourney = getGuestJourney(reservation.status);
                    
                    return (
                      <div className="mt-6 bg-white rounded-lg p-6">
                        <h2 className="text-base font-semibold text-neutral-900 mb-2">Guest Journey</h2>
                        
                        {/* Guest Journey */}
                        <div className="mb-4">
                          {/* Journey Timeline */}
                          <div className="flex items-end justify-center max-w-3xl mx-auto relative py-2">
                            {/* Booking */}
                            <div className="relative flex flex-col items-center">
                              <div className="h-3 mb-0.5">
                                {guestJourney === 'Booking' && (
                                  <div className="text-[8px] font-semibold text-neutral-400 uppercase tracking-wide">
                                    Current
                                  </div>
                                )}
                              </div>
                              <div className={`relative z-10 w-24 h-9 flex items-center justify-center rounded-md text-[10px] font-medium transition-colors ${
                                guestJourney === 'Booking'
                                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                  : 'bg-neutral-50 text-neutral-500 border border-neutral-200 shadow-sm'
                              }`}>
                                Booking
                              </div>
                            </div>
                            
                            {/* Connector 1 */}
                            <div className="w-6 h-[2px] bg-neutral-300 mb-4" />
                            
                            {/* Pre Check-in */}
                            <div className="relative flex flex-col items-center">
                              <div className="h-3 mb-0.5">
                                {guestJourney === 'Pre Check-in' && (
                                  <div className="text-[8px] font-semibold text-neutral-400 uppercase tracking-wide">
                                    Current
                                  </div>
                                )}
                              </div>
                              <div className={`relative z-10 w-24 h-9 flex items-center justify-center rounded-md text-[10px] font-medium transition-colors ${
                                guestJourney === 'Pre Check-in'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : 'bg-neutral-50 text-neutral-500 border border-neutral-200 shadow-sm'
                              }`}>
                                Pre Check-in
                              </div>
                            </div>
                            
                            {/* Connector 2 */}
                            <div className="w-6 h-[2px] bg-neutral-300 mb-4" />
                            
                            {/* Check-in */}
                            <div className="relative flex flex-col items-center">
                              <div className="h-3 mb-0.5">
                                {guestJourney === 'Check-in' && (
                                  <div className="text-[8px] font-semibold text-neutral-400 uppercase tracking-wide">
                                    Current
                                  </div>
                                )}
                              </div>
                              <div className={`relative z-10 w-24 h-9 flex items-center justify-center rounded-md text-[10px] font-medium transition-colors ${
                                guestJourney === 'Check-in'
                                  ? 'bg-green-50 text-green-700 border border-green-200'
                                  : 'bg-neutral-50 text-neutral-500 border border-neutral-200 shadow-sm'
                              }`}>
                                Check-in
                              </div>
                            </div>
                            
                            {/* Connector 3 */}
                            <div className="w-6 h-[2px] bg-neutral-300 mb-4" />
                            
                            {/* During Stay */}
                            <div className="relative flex flex-col items-center">
                              <div className="h-3 mb-0.5">
                                {guestJourney === 'During Stay' && (
                                  <div className="text-[8px] font-semibold text-neutral-400 uppercase tracking-wide">
                                    Current
                                  </div>
                                )}
                              </div>
                              <div className={`relative z-10 w-24 h-9 flex items-center justify-center rounded-md text-[10px] font-medium transition-colors ${
                                guestJourney === 'During Stay'
                                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                  : 'bg-neutral-50 text-neutral-500 border border-neutral-200 shadow-sm'
                              }`}>
                                During Stay
                              </div>
                            </div>
                            
                            {/* Connector 4 */}
                            <div className="w-6 h-[2px] bg-neutral-300 mb-4" />
                            
                            {/* Check-out */}
                            <div className="relative flex flex-col items-center">
                              <div className="h-3 mb-0.5">
                                {guestJourney === 'Check-out' && (
                                  <div className="text-[8px] font-semibold text-neutral-400 uppercase tracking-wide">
                                    Current
                                  </div>
                                )}
                              </div>
                              <div className={`relative z-10 w-24 h-9 flex items-center justify-center rounded-md text-[10px] font-medium transition-colors ${
                                guestJourney === 'Check-out'
                                  ? 'bg-orange-50 text-orange-700 border border-orange-200'
                                  : 'bg-neutral-50 text-neutral-500 border border-neutral-200 shadow-sm'
                              }`}>
                                Check-out
                              </div>
                            </div>
                            
                            {/* Connector 5 */}
                            <div className="w-6 h-[2px] bg-neutral-300 mb-4" />
                            
                            {/* Post Check-out */}
                            <div className="relative flex flex-col items-center">
                              <div className="h-3 mb-0.5">
                                {guestJourney === 'Post Check-out' && (
                                  <div className="text-[8px] font-semibold text-neutral-400 uppercase tracking-wide">
                                    Current
                                  </div>
                                )}
                              </div>
                              <div className={`relative z-10 w-24 h-9 flex items-center justify-center rounded-md text-[10px] font-medium transition-colors ${
                                guestJourney === 'Post Check-out'
                                  ? 'bg-neutral-100 text-neutral-700 border border-neutral-300'
                                  : 'bg-neutral-50 text-neutral-500 border border-neutral-200 shadow-sm'
                              }`}>
                                Post Check-out
                              </div>
                            </div>
                          </div>
                          
                          {/* AI Summary Subtitle */}
                          <h3 className="mt-4 text-xs text-neutral-500">AI Summary:</h3>
                          
                          {/* Summary Bullet Points */}
                          <ul className="mt-2 space-y-0.5 list-none text-xs text-neutral-900">
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
                            className="text-xs text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 transition-colors px-3 py-1.5 rounded-md"
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

      {/* Toggle Chat Panel Button - Fixed position, only show when viewing a reservation */}
      {activeTab !== 'search' && (
        <button
          onClick={() => setIsChatPanelVisible(!isChatPanelVisible)}
          className="fixed top-4 right-4 z-40 flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-neutral-600 bg-white border border-neutral-200 rounded-md hover:bg-neutral-50 hover:text-neutral-900 transition-colors shadow-sm"
        >
          {isChatPanelVisible ? (
            <>
              <PanelRightClose className="h-4 w-4" />
              Hide chat
            </>
          ) : (
            <>
              <PanelRightOpen className="h-4 w-4" />
              Show chat
            </>
          )}
        </button>
      )}

      {/* Fixed Right AI Chat Panel - Only show when viewing a reservation */}
      {activeTab !== 'search' && isChatPanelVisible && (() => {
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

