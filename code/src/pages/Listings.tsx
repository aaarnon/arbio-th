import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockListings, type Listing } from '@/data/mockListings';

/**
 * Listings Component
 * Displays all property listings with search functionality
 */
export function Listings() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
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

  // Handle filter selection
  const handleFilterToggle = (category: string, value: string) => {
    setSelectedFilters(prev => {
      const categoryFilters = prev[category] || [];
      const isSelected = categoryFilters.includes(value);
      
      if (isSelected) {
        // Remove filter
        const newFilters = categoryFilters.filter(f => f !== value);
        if (newFilters.length === 0) {
          const { [category]: _, ...rest } = prev;
          return rest;
        }
        return { ...prev, [category]: newFilters };
      } else {
        // Add filter
        return { ...prev, [category]: [...categoryFilters, value] };
      }
    });
  };

  // Remove specific filter
  const removeFilter = (category: string, value: string) => {
    setSelectedFilters(prev => {
      const categoryFilters = prev[category] || [];
      const newFilters = categoryFilters.filter(f => f !== value);
      if (newFilters.length === 0) {
        const { [category]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [category]: newFilters };
    });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedFilters({});
  };

  // Check if a filter is selected
  const isFilterSelected = (category: string, value: string) => {
    return selectedFilters[category]?.includes(value) || false;
  };

  // Get all selected filter tags
  const getFilterTags = () => {
    const tags: Array<{ category: string; value: string; label: string }> = [];
    Object.entries(selectedFilters).forEach(([category, values]) => {
      values.forEach(value => {
        tags.push({ category, value, label: `${category}: ${value}` });
      });
    });
    return tags;
  };
  
  // Filter listings based on search query
  const filteredListings = mockListings.filter((listing) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      listing.name.toLowerCase().includes(searchLower) ||
      listing.sku.toLowerCase().includes(searchLower)
    );
  });

  const getSanityColor = (percentage: number) => {
    if (percentage >= 95) return 'text-green-600';
    if (percentage >= 85) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-5xl mx-auto px-12 py-8">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-normal text-neutral-900">Apartment</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Manage and track all property listings
        </p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-card p-3 mb-4">
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
                  {/* Country */}
                  <button
                    onClick={() => setActiveSubmenu(activeSubmenu === 'country' ? null : 'country')}
                    className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-neutral-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-xs text-neutral-900">Country</span>
                    </div>
                    <svg className="h-3 w-3 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* City */}
                  <button
                    onClick={() => setActiveSubmenu(activeSubmenu === 'city' ? null : 'city')}
                    className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-neutral-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="text-xs text-neutral-900">City</span>
                    </div>
                    <svg className="h-3 w-3 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Type */}
                  <button
                    onClick={() => setActiveSubmenu(activeSubmenu === 'type' ? null : 'type')}
                    className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-neutral-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span className="text-xs text-neutral-900">Type</span>
                    </div>
                    <svg className="h-3 w-3 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Sanity Check */}
                  <button
                    onClick={() => setActiveSubmenu(activeSubmenu === 'sanity' ? null : 'sanity')}
                    className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-neutral-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <span className="text-xs text-neutral-900">Sanity Check</span>
                    </div>
                    <svg className="h-3 w-3 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Date created */}
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
                </div>

                {/* Submenu Panel */}
                {activeSubmenu && (
                  <div className="absolute left-full top-0 ml-2 w-64 bg-white rounded-lg shadow-lg border border-neutral-200">
                    <div className="py-1 max-h-64 overflow-y-auto">
                      {activeSubmenu === 'country' && (
                        <>
                          <label className="px-3 py-1.5 flex items-center gap-2 hover:bg-neutral-50 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="rounded border-neutral-300 w-3 h-3" 
                              checked={isFilterSelected('Country', 'Germany')}
                              onChange={() => handleFilterToggle('Country', 'Germany')}
                            />
                            <span className="text-xs text-neutral-900">Germany</span>
                          </label>
                          <label className="px-3 py-1.5 flex items-center gap-2 hover:bg-neutral-50 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="rounded border-neutral-300 w-3 h-3" 
                              checked={isFilterSelected('Country', 'Austria')}
                              onChange={() => handleFilterToggle('Country', 'Austria')}
                            />
                            <span className="text-xs text-neutral-900">Austria</span>
                          </label>
                        </>
                      )}
                      {activeSubmenu === 'city' && (
                        <>
                          <label className="px-3 py-1.5 flex items-center gap-2 hover:bg-neutral-50 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="rounded border-neutral-300 w-3 h-3" 
                              checked={isFilterSelected('City', 'Berlin')}
                              onChange={() => handleFilterToggle('City', 'Berlin')}
                            />
                            <span className="text-xs text-neutral-900">Berlin</span>
                          </label>
                          <label className="px-3 py-1.5 flex items-center gap-2 hover:bg-neutral-50 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="rounded border-neutral-300 w-3 h-3" 
                              checked={isFilterSelected('City', 'Frankfurt')}
                              onChange={() => handleFilterToggle('City', 'Frankfurt')}
                            />
                            <span className="text-xs text-neutral-900">Frankfurt</span>
                          </label>
                          <label className="px-3 py-1.5 flex items-center gap-2 hover:bg-neutral-50 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="rounded border-neutral-300 w-3 h-3" 
                              checked={isFilterSelected('City', 'Vienna')}
                              onChange={() => handleFilterToggle('City', 'Vienna')}
                            />
                            <span className="text-xs text-neutral-900">Vienna</span>
                          </label>
                          <label className="px-3 py-1.5 flex items-center gap-2 hover:bg-neutral-50 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="rounded border-neutral-300 w-3 h-3" 
                              checked={isFilterSelected('City', 'Graz')}
                              onChange={() => handleFilterToggle('City', 'Graz')}
                            />
                            <span className="text-xs text-neutral-900">Graz</span>
                          </label>
                          <label className="px-3 py-1.5 flex items-center gap-2 hover:bg-neutral-50 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="rounded border-neutral-300 w-3 h-3" 
                              checked={isFilterSelected('City', 'Leipzig')}
                              onChange={() => handleFilterToggle('City', 'Leipzig')}
                            />
                            <span className="text-xs text-neutral-900">Leipzig</span>
                          </label>
                        </>
                      )}
                      {activeSubmenu === 'type' && (
                        <>
                          <label className="px-3 py-1.5 flex items-center gap-2 hover:bg-neutral-50 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="rounded border-neutral-300 w-3 h-3" 
                              checked={isFilterSelected('Type', 'Single-Unit')}
                              onChange={() => handleFilterToggle('Type', 'Single-Unit')}
                            />
                            <span className="text-xs text-neutral-900">Single-Unit</span>
                          </label>
                          <label className="px-3 py-1.5 flex items-center gap-2 hover:bg-neutral-50 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="rounded border-neutral-300 w-3 h-3" 
                              checked={isFilterSelected('Type', 'Multi-Unit')}
                              onChange={() => handleFilterToggle('Type', 'Multi-Unit')}
                            />
                            <span className="text-xs text-neutral-900">Multi-Unit</span>
                          </label>
                        </>
                      )}
                      {activeSubmenu === 'sanity' && (
                        <>
                          <label className="px-3 py-1.5 flex items-center gap-2 hover:bg-neutral-50 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="rounded border-neutral-300 w-3 h-3" 
                              checked={isFilterSelected('Sanity Check', '0')}
                              onChange={() => handleFilterToggle('Sanity Check', '0')}
                            />
                            <span className="text-xs text-neutral-900">0</span>
                          </label>
                          <label className="px-3 py-1.5 flex items-center gap-2 hover:bg-neutral-50 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="rounded border-neutral-300 w-3 h-3" 
                              checked={isFilterSelected('Sanity Check', '50')}
                              onChange={() => handleFilterToggle('Sanity Check', '50')}
                            />
                            <span className="text-xs text-neutral-900">50</span>
                          </label>
                          <label className="px-3 py-1.5 flex items-center gap-2 hover:bg-neutral-50 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="rounded border-neutral-300 w-3 h-3" 
                              checked={isFilterSelected('Sanity Check', '60')}
                              onChange={() => handleFilterToggle('Sanity Check', '60')}
                            />
                            <span className="text-xs text-neutral-900">60</span>
                          </label>
                          <label className="px-3 py-1.5 flex items-center gap-2 hover:bg-neutral-50 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="rounded border-neutral-300 w-3 h-3" 
                              checked={isFilterSelected('Sanity Check', '70')}
                              onChange={() => handleFilterToggle('Sanity Check', '70')}
                            />
                            <span className="text-xs text-neutral-900">70</span>
                          </label>
                          <label className="px-3 py-1.5 flex items-center gap-2 hover:bg-neutral-50 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="rounded border-neutral-300 w-3 h-3" 
                              checked={isFilterSelected('Sanity Check', '80')}
                              onChange={() => handleFilterToggle('Sanity Check', '80')}
                            />
                            <span className="text-xs text-neutral-900">80</span>
                          </label>
                          <label className="px-3 py-1.5 flex items-center gap-2 hover:bg-neutral-50 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="rounded border-neutral-300 w-3 h-3" 
                              checked={isFilterSelected('Sanity Check', '90')}
                              onChange={() => handleFilterToggle('Sanity Check', '90')}
                            />
                            <span className="text-xs text-neutral-900">90</span>
                          </label>
                          <label className="px-3 py-1.5 flex items-center gap-2 hover:bg-neutral-50 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="rounded border-neutral-300 w-3 h-3" 
                              checked={isFilterSelected('Sanity Check', '100')}
                              onChange={() => handleFilterToggle('Sanity Check', '100')}
                            />
                            <span className="text-xs text-neutral-900">100</span>
                          </label>
                        </>
                      )}
                      {activeSubmenu === 'date' && (
                        <>
                          <label className="px-3 py-1.5 flex items-center gap-2 hover:bg-neutral-50 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="rounded border-neutral-300 w-3 h-3" 
                              checked={isFilterSelected('Date created', 'Last 7 days')}
                              onChange={() => handleFilterToggle('Date created', 'Last 7 days')}
                            />
                            <span className="text-xs text-neutral-900">Last 7 days</span>
                          </label>
                          <label className="px-3 py-1.5 flex items-center gap-2 hover:bg-neutral-50 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="rounded border-neutral-300 w-3 h-3" 
                              checked={isFilterSelected('Date created', 'Last 30 days')}
                              onChange={() => handleFilterToggle('Date created', 'Last 30 days')}
                            />
                            <span className="text-xs text-neutral-900">Last 30 days</span>
                          </label>
                          <label className="px-3 py-1.5 flex items-center gap-2 hover:bg-neutral-50 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="rounded border-neutral-300 w-3 h-3" 
                              checked={isFilterSelected('Date created', 'Last 90 days')}
                              onChange={() => handleFilterToggle('Date created', 'Last 90 days')}
                            />
                            <span className="text-xs text-neutral-900">Last 90 days</span>
                          </label>
                          <label className="px-3 py-1.5 flex items-center gap-2 hover:bg-neutral-50 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="rounded border-neutral-300 w-3 h-3" 
                              checked={isFilterSelected('Date created', 'Last 180 days')}
                              onChange={() => handleFilterToggle('Date created', 'Last 180 days')}
                            />
                            <span className="text-xs text-neutral-900">Last 180 days</span>
                          </label>
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
              placeholder="Search listings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900"
            />
          </div>
        </div>

        {/* Filter Tags */}
        {getFilterTags().length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mt-3">
            {getFilterTags().map((tag, index) => (
              <div
                key={`${tag.category}-${tag.value}-${index}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-xs text-neutral-700 bg-neutral-50 border border-neutral-200 rounded-full"
              >
                <span>{tag.label}</span>
                <button
                  onClick={() => removeFilter(tag.category, tag.value)}
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

      {/* Results Count */}
      {filteredListings.length > 0 && (
        <p className="text-xs text-neutral-400 mb-3">
          Showing {filteredListings.length} of {mockListings.length} listings
        </p>
      )}

      {/* Listings Table */}
      {filteredListings.length === 0 ? (
        <div className="bg-white rounded-card p-12 text-center">
          <p className="text-sm text-neutral-500">No listings found</p>
        </div>
      ) : (
        <div className="bg-white rounded-card p-3">
          <table className="w-full table-fixed">
            <colgroup>
              <col style={{ width: '30%' }} />
              <col style={{ width: '50%' }} />
              <col style={{ width: '15%' }} />
              <col style={{ width: '5%' }} />
            </colgroup>
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="text-left pl-3 pr-3 pb-3 pt-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Apartment
                </th>
                <th className="text-left px-3 pb-3 pt-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="text-left px-3 pb-3 pt-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Sanity %
                </th>
                <th className="text-left pl-3 pr-3 pb-3 pt-3"></th>
              </tr>
            </thead>
            <tbody>
              {filteredListings.map((listing) => (
                <tr
                  key={listing.id}
                  onClick={() => navigate(`/listings/${listing.id}`)}
                  className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  <td className="pl-3 pr-3 py-3">
                    <div className="text-sm text-neutral-900">{listing.name}</div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="text-sm text-neutral-600">{listing.sku}</div>
                  </td>
                  <td className="px-3 py-3">
                    <div className={`text-sm font-medium ${getSanityColor(listing.sanityPercentage)}`}>
                      {listing.sanityPercentage}%
                    </div>
                  </td>
                  <td className="pl-3 pr-3 py-3 text-right">
                    <svg
                      className="h-4 w-4 text-neutral-400 inline-block"
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

