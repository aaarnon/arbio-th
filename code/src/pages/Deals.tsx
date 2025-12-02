import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockDeals } from '@/data/mockDeals';

/**
 * Deals Component
 * Displays all deals with search and filter functionality
 */
export function Deals() {
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
  
  // Filter deals based on search query and selected filters
  const filteredDeals = mockDeals.filter((deal) => {
    // Search filter
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      deal.name.toLowerCase().includes(searchLower) ||
      deal.sku.toLowerCase().includes(searchLower) ||
      deal.apartmentSku.toLowerCase().includes(searchLower);
    
    if (!matchesSearch) return false;

    // Apply selected filters
    for (const [category, values] of Object.entries(selectedFilters)) {
      if (values.length === 0) continue;

      if (category === 'Status') {
        const statusMatch = values.some(value => 
          deal.status === value.toLowerCase().replace(' ', '-')
        );
        if (!statusMatch) return false;
      }
    }

    return true;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'signed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'listing-units':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'live':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-neutral-50 text-neutral-700 border-neutral-200';
    }
  };

  const formatStatusLabel = (status: string) => {
    switch (status) {
      case 'signed':
        return 'Signed';
      case 'listing-units':
        return 'Listing Units';
      case 'live':
        return 'Live';
      default:
        return status;
    }
  };

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="max-w-5xl mx-auto px-12 py-8">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-normal text-neutral-900">Deals</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Manage and track all property deals
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
                </div>

                {/* Submenu Panel */}
                {activeSubmenu && (
                  <div className="absolute left-full top-0 ml-2 w-64 bg-white rounded-lg shadow-lg border border-neutral-200">
                    <div className="py-1 max-h-64 overflow-y-auto">
                      {activeSubmenu === 'status' && (
                        <>
                          {['Signed', 'Listing Units', 'Live'].map(status => (
                            <label key={status} className="px-3 py-1.5 flex items-center gap-2 hover:bg-neutral-50 cursor-pointer">
                              <input 
                                type="checkbox" 
                                className="rounded border-neutral-300 w-3 h-3" 
                                checked={isFilterSelected('Status', status)}
                                onChange={() => handleFilterToggle('Status', status)}
                              />
                              <span className="text-xs text-neutral-900">{status}</span>
                            </label>
                          ))}
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
              placeholder="Search deals..."
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
      {filteredDeals.length > 0 && (
        <p className="text-xs text-neutral-400 mb-3">
          Showing {filteredDeals.length} of {mockDeals.length} deals
        </p>
      )}

      {/* Deals Table */}
      {filteredDeals.length === 0 ? (
        <div className="bg-white rounded-card p-12 text-center">
          <p className="text-sm text-neutral-500">No deals found</p>
        </div>
      ) : (
        <div className="bg-white rounded-card p-3">
          <table className="w-full table-fixed">
            <colgroup>
              <col style={{ width: '30%' }} />
              <col style={{ width: '20%' }} />
              <col style={{ width: '18%' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '15%' }} />
              <col style={{ width: '5%' }} />
            </colgroup>
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="text-left pl-3 pr-3 pb-3 pt-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Deal Name
                </th>
                <th className="text-left px-3 pb-3 pt-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="text-left px-3 pb-3 pt-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="text-left px-3 pb-3 pt-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Total Units
                </th>
                <th className="text-left px-3 pb-3 pt-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left pl-3 pr-3 pb-3 pt-3"></th>
              </tr>
            </thead>
            <tbody>
              {filteredDeals.map((deal) => (
                <tr
                  key={deal.id}
                  onClick={() => navigate(`/deals/${deal.id}`)}
                  className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  <td className="pl-3 pr-3 py-3">
                    <div className="text-sm text-neutral-900">{deal.name}</div>
                    <div className="text-xs text-neutral-500 mt-0.5">{deal.owner}</div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="text-sm text-neutral-600">{deal.sku}</div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="text-sm font-medium text-neutral-900">
                      {formatCurrency(deal.value, deal.currency)}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="text-sm text-neutral-900">{deal.totalUnits}</div>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(deal.status)}`}>
                      {formatStatusLabel(deal.status)}
                    </span>
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

