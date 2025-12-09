import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockListings, type Listing } from '@/data/mockListings';
import { mockCases } from '@/data/mockCases';
import { AIChat } from '@/components/shared/AIChat';
import { Badge } from '@/components/ui/badge';
import { Plus, ArrowLeft, PanelRightClose, PanelRightOpen } from 'lucide-react';

interface Contract {
  id: string;
  name: string;
  description: string;
  file: string | null;
  isEditing: boolean;
}

export function ListingDetail2() {
  const { listingId } = useParams<{ listingId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [listing, setListing] = useState<Listing | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Contract management state
  const [contracts, setContracts] = useState<Contract[]>([
    { id: 'rental', name: 'Rental Contract', description: 'Signed by both landlord and tenant.', file: 'rental_contract.pdf', isEditing: false },
    { id: 'vodafone', name: 'Vodafone Contract', description: 'Latest monthly invoice.', file: null, isEditing: false },
    { id: 'breakfast', name: 'Breakfast Delivery', description: 'Service agreement for breakfast delivery.', file: null, isEditing: false },
  ]);

  // FAQ collapse state
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);
  
  // Specific Instructions collapse state
  const [openInstructionId, setOpenInstructionId] = useState<string | null>(null);

  // Chat panel visibility state
  const [isChatPanelVisible, setIsChatPanelVisible] = useState(true);

  useEffect(() => {
    // Find the listing by ID
    const foundListing = mockListings.find(l => l.id === listingId);
    if (foundListing) {
      setListing(foundListing);
    } else {
      // If listing not found, redirect back to listings
      navigate('/listings-2');
    }
  }, [listingId, navigate]);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!listing) {
    return null;
  }

  // Get open tickets for this listing (excluding DONE and CANCELLED)
  const listingTickets = mockCases
    .filter(c => c.propertyId === listing.id && c.status !== 'DONE' && c.status !== 'CANCELLED')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'checkin', label: 'Check-in' },
    { id: 'details', label: 'Details' },
    { id: 'contracts', label: 'External Services' },
    { id: 'help-manual', label: 'Help Manual' },
    { id: 'custom-fields', label: 'Custom Fields' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Toggle Chat Panel Button - Fixed position */}
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

      {/* Main Content - With right margin for chat when visible */}
      <div className={`${isChatPanelVisible ? 'mr-[420px]' : 'mr-0'} w-full px-8 pt-6 transition-all duration-300`}>
        {/* Back Button and Title Section */}
        <div className="mb-6">
          {/* Back Button and Title on same line */}
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => navigate(-1)}
              className="text-neutral-900 hover:text-neutral-600 transition-colors flex-shrink-0"
              aria-label="Back to previous page"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-semibold text-neutral-900">{listing.name}</h1>
          </div>
          
          {/* Address - aligned with title */}
          <p className="text-sm text-neutral-400 mb-2 ml-8">{listing.address}</p>
          
          {/* Tags - aligned with title */}
          <div className="flex items-center gap-2 flex-wrap ml-8">
            {/* ID Tag */}
            <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-neutral-600 bg-neutral-100 rounded">
              ID: {listing.sku}
            </span>
            
            {/* Deal SKU Tag (clickable) */}
            <button
              onClick={() => navigate(`/deals`)}
              className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-neutral-600 bg-neutral-100 hover:bg-neutral-200 rounded transition-colors"
            >
              Deal SKU: <span className="underline">{listing.dealSku}</span>
            </button>
          </div>
        </div>
        
        {/* Tabs Navigation */}
        <div className="border-b border-neutral-200 mb-8">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-2 px-3 text-sm font-normal transition-colors relative flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-neutral-900 font-medium'
                    : 'text-neutral-500 hover:text-neutral-600'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab Content */}
        {activeTab === 'overview' && (
          <div className="w-full max-w-[50.16rem]">
            {/* Section 1: Summary */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <h2 className="text-base font-semibold text-neutral-900 mb-4">Summary</h2>
              <div className="space-y-3">
                {/* Availability and Readiness on same row */}
                <div className="flex items-center gap-6">
                  {/* Availability */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-500">Availability:</span>
                    {listing.availability === 'free' && (
                      <Badge className="bg-green-50 text-green-700 border-green-200">
                        Free
                      </Badge>
                    )}
                    {listing.availability === 'occupied' && (
                      <Badge className="bg-amber-50 text-amber-700 border-amber-200">
                        Occupied
                      </Badge>
                    )}
                    {listing.availability === 'reserved' && (
                      <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                        Reserved
                      </Badge>
                    )}
                  </div>

                  {/* Readiness */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-500">Readiness:</span>
                    {listing.readiness === 'ready' && (
                      <Badge className="bg-green-50 text-green-700 border-green-200">
                        Ready
                      </Badge>
                    )}
                    {listing.readiness === 'needs-cleaning' && (
                      <Badge className="bg-red-50 text-red-700 border-red-200">
                        Needs Cleaning
                      </Badge>
                    )}
                    {listing.readiness === 'maintenance' && (
                      <Badge className="bg-amber-50 text-amber-700 border-amber-200">
                        Maintenance
                      </Badge>
                    )}
                  </div>
                </div>

                {/* AI Sentiment */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-neutral-500">AI Sentiment:</span>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {listing.aiSentiment}
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2: Reservations */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <h2 className="text-base font-semibold text-neutral-900 mb-4">Reservations</h2>
              <div className="grid grid-cols-3 gap-6">
                {/* Previous Column */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-neutral-500 mb-3">Previous</h3>
                  <div className="space-y-1">
                    <p className="text-xs">
                      <span className="text-neutral-500">Guest: </span>
                      <span className="text-neutral-900">Sarah Johnson</span>
                    </p>
                    <p className="text-xs">
                      <span className="text-neutral-500">Dates: </span>
                      <span className="text-neutral-900">18 Nov - 24 Nov</span>
                    </p>
                    <p className="text-xs">
                      <span className="text-neutral-500">Status: </span>
                      <span className="text-neutral-900">Checked Out</span>
                    </p>
                  </div>
                  <button 
                    onClick={() => navigate('/reservations')}
                    className="text-xs text-neutral-400 hover:text-neutral-600 underline transition-colors"
                  >
                    View more
                  </button>
                </div>

                {/* Current Column */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-neutral-500 mb-3">Current</h3>
                  <div className="space-y-1">
                    <p className="text-xs">
                      <span className="text-neutral-500">Guest: </span>
                      <span className="text-neutral-900">Michael Chen</span>
                    </p>
                    <p className="text-xs">
                      <span className="text-neutral-500">Dates: </span>
                      <span className="text-neutral-900">24 Nov - 01 Dec</span>
                    </p>
                    <p className="text-xs">
                      <span className="text-neutral-500">Status: </span>
                      <span className="text-neutral-900">In House</span>
                    </p>
                  </div>
                  <button 
                    onClick={() => navigate('/reservations')}
                    className="text-xs text-neutral-400 hover:text-neutral-600 underline transition-colors"
                  >
                    View more
                  </button>
                </div>

                {/* Next Column */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-neutral-500 mb-3">Next</h3>
                  <div className="space-y-1">
                    <p className="text-xs">
                      <span className="text-neutral-500">Guest: </span>
                      <span className="text-neutral-900">Emma Rodriguez</span>
                    </p>
                    <p className="text-xs">
                      <span className="text-neutral-500">Dates: </span>
                      <span className="text-neutral-900">01 Dec - 08 Dec</span>
                    </p>
                    <p className="text-xs">
                      <span className="text-neutral-500">Status: </span>
                      <span className="text-neutral-900">Confirmed</span>
                    </p>
                  </div>
                  <button 
                    onClick={() => navigate('/reservations')}
                    className="text-xs text-neutral-400 hover:text-neutral-600 underline transition-colors"
                  >
                    View more
                  </button>
                </div>
              </div>
            </div>

            {/* Section 3: Open Tickets */}
            <div className="bg-white rounded-lg pt-6 px-6 pb-2 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-neutral-900">Open Tickets</h2>
                <button 
                  onClick={() => navigate('/cases')}
                  className="text-xs text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 transition-colors px-3 py-1.5 rounded-md"
                >
                  View history
                </button>
              </div>
              
              {/* Scrollable ticket list - Fixed height to show ~5 tickets */}
              <div className="max-h-[220px] overflow-y-auto border-b border-neutral-100">
                {listingTickets.length > 0 ? (
                  listingTickets.map((ticket) => (
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
                        <Badge className={getStatusColor(ticket.status)}>
                          {formatStatus(ticket.status)}
                        </Badge>
                        <span className="text-xs text-neutral-500 whitespace-nowrap">
                          {formatDate(ticket.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-neutral-500 py-4 text-center">
                    No tickets found for this listing
                  </div>
                )}
              </div>

              {/* Add Case Button - Fixed at bottom */}
              <button className="w-full flex items-center justify-center gap-2 pt-3 pb-1 text-sm text-neutral-500 hover:text-neutral-700 transition-colors">
                <Plus className="h-4 w-4" />
                <span>Add Case</span>
              </button>
            </div>

            {/* Section 4: Sanity Check */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <h2 className="text-base font-semibold text-neutral-900 mb-4">Sanity Check</h2>
              <div className="space-y-4">
                {/* Health Level */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-500">Health level:</span>
                  <Badge className="bg-red-50 text-red-700 border-red-200">
                    50%
                  </Badge>
                </div>

                {/* Improvements */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-neutral-500">Improvements:</span>
                  <ul className="space-y-1.5 ml-4">
                    <li className="text-xs text-neutral-600 flex items-start gap-2">
                      <span className="text-neutral-400 mt-0.5">•</span>
                      <span>wifiUsername missing</span>
                    </li>
                    <li className="text-xs text-neutral-600 flex items-start gap-2">
                      <span className="text-neutral-400 mt-0.5">•</span>
                      <span>wifiPassword missing</span>
                    </li>
                    <li className="text-xs text-neutral-600 flex items-start gap-2">
                      <span className="text-neutral-400 mt-0.5">•</span>
                      <span>listing_nukilockid missing</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Check-in Tab Content */}
        {activeTab === 'checkin' && (
          <div className="w-full max-w-[50.16rem]">
            {/* Section 1: Access Method */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-neutral-900">Access Method</h2>
                <button className="text-xs text-neutral-600 px-2 py-1 rounded hover:bg-neutral-100 transition-colors">
                  Edit
                </button>
              </div>
              
              {/* Access Method Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-200">
                      <th className="text-left py-2 px-2 text-xs font-semibold text-neutral-900">Access Point</th>
                      <th className="text-left py-2 px-2 text-xs font-semibold text-neutral-900">Lock Classification</th>
                      <th className="text-left py-2 px-2 text-xs font-semibold text-neutral-900">Lock Type</th>
                      <th className="text-left py-2 px-2 text-xs font-semibold text-neutral-900">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Building door row */}
                    <tr className="border-b border-neutral-100">
                      <td className="py-2 px-2 text-xs text-neutral-900">Building door</td>
                      <td className="py-2 px-2 text-xs text-neutral-900">Primary Access</td>
                      <td className="py-2 px-2 text-xs text-neutral-900">Physical key</td>
                      <td className="py-2 px-2 text-xs text-neutral-900">
                        <div className="space-y-0.5">
                          <div>Lock Subtype:</div>
                          <div>Default Code: 2404</div>
                          <div>Storage Type: Keybox</div>
                        </div>
                      </td>
                    </tr>
                    {/* Apartment door row */}
                    <tr className="border-b border-neutral-100">
                      <td className="py-2 px-2 text-xs text-neutral-900">Apartment door</td>
                      <td className="py-2 px-2 text-xs text-neutral-900">Primary Access</td>
                      <td className="py-2 px-2 text-xs text-neutral-900">Nuki</td>
                      <td className="py-2 px-2 text-xs text-neutral-900">Lock Subtype: Opener, Keypad</td>
                    </tr>
                    {/* Smart lock row */}
                    <tr className="border-b border-neutral-100">
                      <td className="py-2 px-2 text-xs text-neutral-900">Smart lock</td>
                      <td className="py-2 px-2 text-xs text-neutral-900">-</td>
                      <td className="py-2 px-2 text-xs text-neutral-900">-</td>
                      <td className="py-2 px-2 text-xs text-neutral-900">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 2: Check-in Guide */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-neutral-900">Check-in Guide</h2>
                <button className="text-xs text-neutral-600 px-2 py-1 rounded hover:bg-neutral-100 transition-colors">
                  Edit
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Step 1: Locate the Key Box */}
                <div className="flex gap-3 items-start">
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                    <span className="text-xs font-semibold text-neutral-600">1</span>
                  </div>
                  <div className="flex-shrink-0 w-16 h-16 bg-neutral-200 rounded overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400">
                      Image
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-semibold text-neutral-900 mb-1">Locate the Key Box</h3>
                    <p className="text-xs text-neutral-600">Upon arrival at the address, please find the key box next to the building entrance.</p>
                  </div>
                </div>

                {/* Step 2: Access Your Keys */}
                <div className="flex gap-3 items-start">
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                    <span className="text-xs font-semibold text-neutral-600">2</span>
                  </div>
                  <div className="flex-shrink-0 w-16 h-16 bg-neutral-200 rounded overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400">
                      Image
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-semibold text-neutral-900 mb-1">Access Your Keys</h3>
                    <p className="text-xs text-neutral-600 mb-2">Retrieve the keys by using the code</p>
                    <div className="text-xs text-neutral-500 italic space-y-0.5">
                      <div>Access method: Primary</div>
                      <div>Lock type: physical_key</div>
                      <div>Lock code: 2404</div>
                      <div>Storage type: keybox</div>
                    </div>
                  </div>
                </div>

                {/* Step 3: Navigate Inside the Building */}
                <div className="flex gap-3 items-start">
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                    <span className="text-xs font-semibold text-neutral-600">3</span>
                  </div>
                  <div className="flex-shrink-0 w-16 h-16 bg-neutral-200 rounded overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400">
                      Image
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-semibold text-neutral-900 mb-1">Navigate Inside the Building</h3>
                    <p className="text-xs text-neutral-600">Open the door and proceed straight through the backyard towards the yellow building</p>
                  </div>
                </div>

                {/* Step 4: Locate your Apartment */}
                <div className="flex gap-3 items-start">
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                    <span className="text-xs font-semibold text-neutral-600">4</span>
                  </div>
                  <div className="flex-shrink-0 w-16 h-16 bg-neutral-200 rounded overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400">
                      Image
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-semibold text-neutral-900 mb-1">Locate your Apartment</h3>
                    <p className="text-xs text-neutral-600">Your apartment is located just behind the door on the left of the stairs.</p>
                  </div>
                </div>

                {/* Step 5: Enter your Apartment */}
                <div className="flex gap-3 items-start">
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                    <span className="text-xs font-semibold text-neutral-600">5</span>
                  </div>
                  <div className="flex-shrink-0 w-16 h-16 bg-neutral-200 rounded overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400">
                      Image
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-semibold text-neutral-900 mb-1">Enter your Apartment</h3>
                    <p className="text-xs text-neutral-600 mb-2">The apartment door can be opened via the information provided above</p>
                    <div className="text-xs text-neutral-500 italic space-y-0.5">
                      <div>Access method: Primary</div>
                      <div>Lock type: nuki</div>
                      <div>Lock subtype: Opener, Keypad</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Details Tab Content */}
        {activeTab === 'details' && (
          <div className="w-full max-w-[50.16rem]">
            {/* Section 1: Directions */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-neutral-900">Directions</h2>
                <button className="text-xs text-neutral-600 px-2 py-1 rounded hover:bg-neutral-100 transition-colors">
                  Edit
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-neutral-500">Address:</span>
                  <span className="text-xs text-neutral-900">{listing.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(listing.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-700 underline transition-colors"
                  >
                    Open in Google Maps →
                  </a>
                </div>
              </div>
            </div>

            {/* Section 2: Links */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-neutral-900">Links</h2>
                <button className="text-xs text-neutral-600 px-2 py-1 rounded hover:bg-neutral-100 transition-colors">
                  Edit
                </button>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {/* OTA Links */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-neutral-900">OTA Channels</span>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-neutral-500">Booking.com:</span>
                      <a 
                        href="https://www.booking.com/hotel/listing"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-700 underline transition-colors"
                      >
                        View listing
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-neutral-500">Airbnb:</span>
                      <a 
                        href="https://www.airbnb.com/rooms/listing"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-700 underline transition-colors"
                      >
                        View listing
                      </a>
                    </div>
                  </div>
                </div>

                {/* PMS Link */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-neutral-900">Property Management System</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-500">Hostaway:</span>
                    <a 
                      href={`https://dashboard.hostaway.com/listings/${listing.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-700 underline transition-colors"
                    >
                      View in Hostaway
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Amenities */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-neutral-900">Amenities</h2>
                <button className="text-xs text-neutral-600 px-2 py-1 rounded hover:bg-neutral-100 transition-colors">
                  Edit
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-900">✓ WiFi</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-900">✓ Air Conditioning</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-900">✓ Kitchen</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-900">✓ Washing Machine</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-900">✓ TV</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-900">✓ Heating</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-900">✓ Iron</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-900">✓ Hair Dryer</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-900">✓ Smoke Detector</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-900">✓ Fire Extinguisher</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-900">✓ Coffee Maker</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-900">✓ Dishwasher</span>
                </div>
              </div>
            </div>

            {/* Section 4: WiFi */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-neutral-900">WiFi</h2>
                <button className="text-xs text-neutral-600 px-2 py-1 rounded hover:bg-neutral-100 transition-colors">
                  Edit
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-500">Network Name:</span>
                  <span className="text-xs text-neutral-900 font-mono">HomeNetwork_5G</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-500">Password:</span>
                  <span className="text-xs text-neutral-900 font-mono">SecurePass123!</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-neutral-500">Instructions:</span>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    The router is located in the living room. If you experience connectivity issues, please restart the router by unplugging it for 10 seconds and plugging it back in. For support, contact property management.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 5: Parking */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-neutral-900">Parking</h2>
                <button className="text-xs text-neutral-600 px-2 py-1 rounded hover:bg-neutral-100 transition-colors">
                  Edit
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-neutral-900">Street Parking</span>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Free street parking available on Hauptstraße. Please note parking restrictions during peak hours (8 AM - 10 AM, Mon-Fri).
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-neutral-900">Parking Garage</span>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Parking garage entrance at Nebenstraße 12. Use access code: <span className="font-mono font-semibold">2404</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-500">Parking Spots:</span>
                  <span className="text-xs text-neutral-900">1 dedicated spot included</span>
                </div>
              </div>
            </div>

            {/* Section 6: Heating */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-neutral-900">Heating</h2>
                <button className="text-xs text-neutral-600 px-2 py-1 rounded hover:bg-neutral-100 transition-colors">
                  Edit
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-500">System Type:</span>
                  <span className="text-xs text-neutral-900">Central Heating</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-500">Thermostat Location:</span>
                  <span className="text-xs text-neutral-900">Living Room Wall</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-neutral-900">Operation Instructions</span>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    The heating system is controlled by the thermostat on the wall in the living room. Set your desired temperature between 18-24°C. The system will automatically maintain the temperature. For night mode, press the moon button to reduce heating during sleeping hours.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 7: Garbage Disposal */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-neutral-900">Garbage Disposal</h2>
                <button className="text-xs text-neutral-600 px-2 py-1 rounded hover:bg-neutral-100 transition-colors">
                  Edit
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-neutral-900">Waste Separation</span>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Separate waste bins are located in the kitchen. Please sort waste properly:
                  </p>
                  <ul className="space-y-1.5 ml-4">
                    <li className="text-xs text-neutral-600 flex items-start gap-2">
                      <span className="text-neutral-400 mt-0.5">•</span>
                      <span><strong>Paper</strong> - Blue bin</span>
                    </li>
                    <li className="text-xs text-neutral-600 flex items-start gap-2">
                      <span className="text-neutral-400 mt-0.5">•</span>
                      <span><strong>Plastic/Packaging</strong> - Yellow bin</span>
                    </li>
                    <li className="text-xs text-neutral-600 flex items-start gap-2">
                      <span className="text-neutral-400 mt-0.5">•</span>
                      <span><strong>Glass</strong> - White bin</span>
                    </li>
                    <li className="text-xs text-neutral-600 flex items-start gap-2">
                      <span className="text-neutral-400 mt-0.5">•</span>
                      <span><strong>Organic Waste</strong> - Brown bin</span>
                    </li>
                    <li className="text-xs text-neutral-600 flex items-start gap-2">
                      <span className="text-neutral-400 mt-0.5">•</span>
                      <span><strong>General Waste</strong> - Grey bin</span>
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-neutral-900">Collection Schedule</span>
                  <ul className="space-y-1.5 ml-4">
                    <li className="text-xs text-neutral-600 flex items-start gap-2">
                      <span className="text-neutral-400 mt-0.5">•</span>
                      <span>General Waste: Monday & Thursday</span>
                    </li>
                    <li className="text-xs text-neutral-600 flex items-start gap-2">
                      <span className="text-neutral-400 mt-0.5">•</span>
                      <span>Recycling: Wednesday</span>
                    </li>
                    <li className="text-xs text-neutral-600 flex items-start gap-2">
                      <span className="text-neutral-400 mt-0.5">•</span>
                      <span>Organic: Tuesday & Friday</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 8: Equipment & Instructions */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-neutral-900">Equipment & Instructions</h2>
                <button className="text-xs text-neutral-600 px-2 py-1 rounded hover:bg-neutral-100 transition-colors">
                  Edit
                </button>
              </div>
              <div className="space-y-4">
                {/* Washing Machine */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-neutral-900">Washing Machine</span>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    <strong>Location:</strong> Bathroom<br />
                    <strong>Brand:</strong> Bosch Serie 6<br />
                    <strong>Instructions:</strong> Use the provided detergent pods in the drawer. Select the appropriate program: 30°C for delicates, 40°C for colors, and 60°C for whites. Do not overload the machine. Hang clothes to dry on the drying rack provided in the utility closet.
                  </p>
                </div>

                {/* Coffee Machine */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-neutral-900">Coffee Machine</span>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    <strong>Location:</strong> Kitchen Counter<br />
                    <strong>Brand:</strong> Nespresso Vertuo<br />
                    <strong>Instructions:</strong> Insert a coffee capsule, close the lever, and press the button. The machine will automatically brew. Capsules are provided in the pantry. Descale monthly using the provided descaling solution.
                  </p>
                </div>

                {/* TV & Entertainment */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-neutral-900">TV & Entertainment</span>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    <strong>Location:</strong> Living Room<br />
                    <strong>Brand:</strong> Samsung Smart TV 55"<br />
                    <strong>Instructions:</strong> Use the Samsung remote to turn on. Netflix, Disney+, and Amazon Prime are pre-installed. Select your profile or create a new one. Please log out before check-out.
                  </p>
                </div>

                {/* Dishwasher */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-neutral-900">Dishwasher</span>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    <strong>Location:</strong> Kitchen<br />
                    <strong>Brand:</strong> Miele G 7000<br />
                    <strong>Instructions:</strong> Load dishes, add detergent tab to the dispenser, and select the appropriate cycle. For light loads use "Quick" program. For pots and pans use "Intensive" program.
                  </p>
                </div>

                {/* Air Conditioning */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-neutral-900">Air Conditioning</span>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    <strong>Location:</strong> Living Room & Bedroom<br />
                    <strong>Brand:</strong> Daikin<br />
                    <strong>Instructions:</strong> Use the remote control to adjust temperature (recommended 22-24°C). Press MODE to switch between cooling, heating, and fan. Press TIMER to schedule on/off times.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 9: Floor Plans */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-neutral-900">Floor Plans</h2>
                <button className="text-xs text-neutral-600 px-2 py-1 rounded hover:bg-neutral-100 transition-colors">
                  Edit
                </button>
              </div>
              <div className="space-y-4">
                {/* Main Floor Plan */}
                <div className="flex flex-col gap-3">
                  <span className="text-xs font-semibold text-neutral-900">Main Floor Plan</span>
                  <div className="w-full h-64 bg-neutral-100 rounded-lg flex items-center justify-center border border-neutral-200">
                    <div className="text-center">
                      <div className="text-neutral-400 mb-2">
                        <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-xs text-neutral-500">Floor plan image placeholder</span>
                    </div>
                  </div>
                  <button className="text-xs text-blue-600 hover:text-blue-700 underline transition-colors">
                    Download PDF
                  </button>
                </div>
              </div>
            </div>

            {/* Section 10: Pictures */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-neutral-900">Pictures</h2>
                <button className="text-xs text-neutral-600 px-2 py-1 rounded hover:bg-neutral-100 transition-colors">
                  Edit
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {/* Living Room */}
                <div className="flex flex-col gap-2">
                  <div className="w-full h-32 bg-neutral-100 rounded-lg flex items-center justify-center border border-neutral-200">
                    <div className="text-center">
                      <div className="text-neutral-400 mb-1">
                        <svg className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-xs text-neutral-500">Living Room</span>
                    </div>
                  </div>
                </div>

                {/* Bedroom */}
                <div className="flex flex-col gap-2">
                  <div className="w-full h-32 bg-neutral-100 rounded-lg flex items-center justify-center border border-neutral-200">
                    <div className="text-center">
                      <div className="text-neutral-400 mb-1">
                        <svg className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-xs text-neutral-500">Bedroom</span>
                    </div>
                  </div>
                </div>

                {/* Kitchen */}
                <div className="flex flex-col gap-2">
                  <div className="w-full h-32 bg-neutral-100 rounded-lg flex items-center justify-center border border-neutral-200">
                    <div className="text-center">
                      <div className="text-neutral-400 mb-1">
                        <svg className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-xs text-neutral-500">Kitchen</span>
                    </div>
                  </div>
                </div>

                {/* Bathroom */}
                <div className="flex flex-col gap-2">
                  <div className="w-full h-32 bg-neutral-100 rounded-lg flex items-center justify-center border border-neutral-200">
                    <div className="text-center">
                      <div className="text-neutral-400 mb-1">
                        <svg className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-xs text-neutral-500">Bathroom</span>
                    </div>
                  </div>
                </div>

                {/* Balcony */}
                <div className="flex flex-col gap-2">
                  <div className="w-full h-32 bg-neutral-100 rounded-lg flex items-center justify-center border border-neutral-200">
                    <div className="text-center">
                      <div className="text-neutral-400 mb-1">
                        <svg className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-xs text-neutral-500">Balcony</span>
                    </div>
                  </div>
                </div>

                {/* Building Entrance */}
                <div className="flex flex-col gap-2">
                  <div className="w-full h-32 bg-neutral-100 rounded-lg flex items-center justify-center border border-neutral-200">
                    <div className="text-center">
                      <div className="text-neutral-400 mb-1">
                        <svg className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-xs text-neutral-500">Building Entrance</span>
                    </div>
                  </div>
                </div>
              </div>
              <button className="w-full flex items-center justify-center gap-2 mt-4 py-2 px-4 text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-md transition-colors">
                <Plus className="h-4 w-4" />
                <span>Upload More Pictures</span>
              </button>
            </div>
          </div>
        )}

        {/* Contracts Tab Content */}
        {activeTab === 'contracts' && (
          <div className="w-full max-w-[50.16rem]">
            {/* Section 1: Contract Documents Table */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <h2 className="text-base font-semibold text-neutral-900 mb-4">Documents</h2>
              
              {/* Contract Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-200">
                      <th className="text-left py-3 px-3 text-xs font-semibold text-neutral-900">Name</th>
                      <th className="text-left py-3 px-3 text-xs font-semibold text-neutral-900">Description</th>
                      <th className="text-left py-3 px-3 text-xs font-semibold text-neutral-900">File</th>
                      <th className="text-left py-3 px-3 text-xs font-semibold text-neutral-900">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contracts.map((contract) => (
                      <tr key={contract.id} className="border-b border-neutral-100">
                        {/* Name Column */}
                        <td className="py-3 px-3 text-xs text-neutral-900">
                          {contract.isEditing ? (
                            <input
                              type="text"
                              value={contract.name}
                              onChange={(e) => {
                                setContracts(contracts.map(c => 
                                  c.id === contract.id ? { ...c, name: e.target.value } : c
                                ));
                              }}
                              placeholder="Contract name"
                              className="w-full px-2 py-1 text-xs border border-neutral-300 rounded focus:outline-none focus:border-neutral-500"
                            />
                          ) : (
                            contract.name
                          )}
                        </td>
                        
                        {/* Description Column */}
                        <td className="py-3 px-3 text-xs text-neutral-600">
                          {contract.isEditing ? (
                            <input
                              type="text"
                              value={contract.description}
                              onChange={(e) => {
                                setContracts(contracts.map(c => 
                                  c.id === contract.id ? { ...c, description: e.target.value } : c
                                ));
                              }}
                              placeholder="Description"
                              className="w-full px-2 py-1 text-xs border border-neutral-300 rounded focus:outline-none focus:border-neutral-500"
                            />
                          ) : (
                            contract.description
                          )}
                        </td>
                        
                        {/* File Column */}
                        <td className="py-3 px-3">
                          {contract.file ? (
                            <div className="flex items-center gap-2">
                              <div className="flex-shrink-0 text-neutral-400">
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                              <span className="text-xs text-neutral-600">{contract.file}</span>
                            </div>
                          ) : (
                            <button className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-700 transition-colors">
                              <Plus className="h-3.5 w-3.5" />
                              Upload Document
                            </button>
                          )}
                        </td>
                        
                        {/* Action Column */}
                        <td className="py-3 px-3">
                          {contract.isEditing ? (
                            <button
                              onClick={() => {
                                setContracts(contracts.map(c => 
                                  c.id === contract.id ? { ...c, isEditing: false } : c
                                ));
                              }}
                              className="text-xs text-green-600 hover:text-green-700 font-medium"
                            >
                              Save
                            </button>
                          ) : (
                            <div className="relative" ref={openMenuId === contract.id ? menuRef : null}>
                              <button 
                                onClick={() => setOpenMenuId(openMenuId === contract.id ? null : contract.id)}
                                className="text-neutral-400 hover:text-neutral-600 transition-colors"
                              >
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                  <circle cx="12" cy="5" r="1.5" />
                                  <circle cx="12" cy="12" r="1.5" />
                                  <circle cx="12" cy="19" r="1.5" />
                                </svg>
                              </button>
                              {openMenuId === contract.id && (
                                <div className="absolute right-0 mt-1 w-28 bg-white rounded-md shadow-lg border border-neutral-200 py-1 z-10">
                                  <button 
                                    onClick={() => {
                                      setContracts(contracts.map(c => 
                                        c.id === contract.id ? { ...c, isEditing: true } : c
                                      ));
                                      setOpenMenuId(null);
                                    }}
                                    className="w-full text-left px-3 py-1.5 text-xs text-neutral-700 hover:bg-neutral-50 transition-colors"
                                  >
                                    Edit
                                  </button>
                                  <button 
                                    onClick={() => {
                                      setContracts(contracts.filter(c => c.id !== contract.id));
                                      setOpenMenuId(null);
                                    }}
                                    className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-neutral-50 transition-colors"
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Add Contract Button */}
              <button
                onClick={() => {
                  const newContract = {
                    id: `contract-${Date.now()}`,
                    name: '',
                    description: '',
                    file: null,
                    isEditing: true
                  };
                  setContracts([...contracts, newContract]);
                }}
                className="flex items-center justify-center gap-2 py-2 px-4 text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-md transition-colors w-full mt-4"
              >
                <Plus className="h-4 w-4" />
                Add contract
              </button>
            </div>
          </div>
        )}

        {/* Custom Fields Tab Content */}
        {activeTab === 'custom-fields' && (
          <div className="w-full max-w-[50.16rem]">
            {/* Section 1: Custom Fields */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <h2 className="text-base font-semibold text-neutral-900 mb-4">Custom Fields</h2>
              <div className="text-sm text-neutral-500 py-4">
                Custom fields information will be displayed here
              </div>
            </div>
          </div>
        )}

        {/* Help Manual Tab Content */}
        {activeTab === 'help-manual' && (
          <div className="w-full max-w-[50.16rem]">
            {/* Section 1: FAQ */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-neutral-900">FAQ</h2>
                <button className="px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100 rounded-md transition-colors">
                  Edit
                </button>
              </div>
              
              <div className="space-y-0">
                {/* FAQ Item 1 */}
                <div className="rounded-lg overflow-hidden">
                  <button
                    onClick={() => setOpenFaqId(openFaqId === 'faq1' ? null : 'faq1')}
                    className="w-full flex items-center justify-between px-4 py-2 text-left hover:bg-neutral-50 transition-colors"
                  >
                    <span className="text-sm text-neutral-900 font-medium">What is the check-in and check-out time?</span>
                    <svg
                      className={`h-4 w-4 text-neutral-500 transition-transform ${openFaqId === 'faq1' ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFaqId === 'faq1' && (
                    <div className="px-4 pb-4 pt-1">
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        Check-in time is from 3:00 PM onwards, and check-out is by 11:00 AM. If you need an early check-in or late check-out, please contact us in advance and we'll do our best to accommodate your request based on availability.
                      </p>
                    </div>
                  )}
                </div>

                {/* FAQ Item 2 */}
                <div className="rounded-lg overflow-hidden">
                  <button
                    onClick={() => setOpenFaqId(openFaqId === 'faq2' ? null : 'faq2')}
                    className="w-full flex items-center justify-between px-4 py-2 text-left hover:bg-neutral-50 transition-colors"
                  >
                    <span className="text-sm text-neutral-900 font-medium">How do I access the WiFi?</span>
                    <svg
                      className={`h-4 w-4 text-neutral-500 transition-transform ${openFaqId === 'faq2' ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFaqId === 'faq2' && (
                    <div className="px-4 pb-4 pt-1">
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        WiFi credentials are provided in the welcome booklet inside the apartment. The network name and password are also displayed on a card near the router in the living room. If you experience any connectivity issues, please restart the router or contact support.
                      </p>
                    </div>
                  )}
                </div>

                {/* FAQ Item 3 */}
                <div className="rounded-lg overflow-hidden">
                  <button
                    onClick={() => setOpenFaqId(openFaqId === 'faq3' ? null : 'faq3')}
                    className="w-full flex items-center justify-between px-4 py-2 text-left hover:bg-neutral-50 transition-colors"
                  >
                    <span className="text-sm text-neutral-900 font-medium">Where can I park my car?</span>
                    <svg
                      className={`h-4 w-4 text-neutral-500 transition-transform ${openFaqId === 'faq3' ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFaqId === 'faq3' && (
                    <div className="px-4 pb-4 pt-1">
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        Free street parking is available on Hauptstraße. There's also a parking garage at Nebenstraße 12 - use code 2404 for access. Please note that street parking may require a parking disc during certain hours.
                      </p>
                    </div>
                  )}
                </div>

                {/* FAQ Item 4 */}
                <div className="rounded-lg overflow-hidden">
                  <button
                    onClick={() => setOpenFaqId(openFaqId === 'faq4' ? null : 'faq4')}
                    className="w-full flex items-center justify-between px-4 py-2 text-left hover:bg-neutral-50 transition-colors"
                  >
                    <span className="text-sm text-neutral-900 font-medium">What should I do if I have a maintenance issue?</span>
                    <svg
                      className={`h-4 w-4 text-neutral-500 transition-transform ${openFaqId === 'faq4' ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFaqId === 'faq4' && (
                    <div className="px-4 pb-4 pt-1">
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        For any maintenance issues, please contact our property manager at +49 30 1234 5678. For urgent matters outside business hours, use the emergency contact number provided in your welcome email. We aim to resolve all issues within 24 hours.
                      </p>
                    </div>
                  )}
                </div>

                {/* FAQ Item 5 */}
                <div className="rounded-lg overflow-hidden">
                  <button
                    onClick={() => setOpenFaqId(openFaqId === 'faq5' ? null : 'faq5')}
                    className="w-full flex items-center justify-between px-4 py-2 text-left hover:bg-neutral-50 transition-colors"
                  >
                    <span className="text-sm text-neutral-900 font-medium">Are pets allowed in the apartment?</span>
                    <svg
                      className={`h-4 w-4 text-neutral-500 transition-transform ${openFaqId === 'faq5' ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFaqId === 'faq5' && (
                    <div className="px-4 pb-4 pt-1">
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        Unfortunately, pets are not allowed in this apartment. This policy helps us maintain the property for guests with allergies and ensures a comfortable environment for all visitors. Service animals are an exception - please contact us in advance to make arrangements.
                      </p>
                    </div>
                  )}
                </div>

                {/* FAQ Item 6 */}
                <div className="rounded-lg overflow-hidden">
                  <button
                    onClick={() => setOpenFaqId(openFaqId === 'faq6' ? null : 'faq6')}
                    className="w-full flex items-center justify-between px-4 py-2 text-left hover:bg-neutral-50 transition-colors"
                  >
                    <span className="text-sm text-neutral-900 font-medium">How do I dispose of garbage and recycling?</span>
                    <svg
                      className={`h-4 w-4 text-neutral-500 transition-transform ${openFaqId === 'faq6' ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFaqId === 'faq6' && (
                    <div className="px-4 pb-4 pt-1">
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        Separate waste bins are located in the kitchen. Please sort waste as follows: Paper (blue bin), Plastic/Packaging (yellow bin), Glass (white bin), Organic waste (brown bin), and General waste (grey bin). Recycling bins are located in the basement or courtyard area.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Specific Instructions */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-neutral-900">Specific Instructions</h2>
                <button className="px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100 rounded-md transition-colors">
                  Edit
                </button>
              </div>
              
              <div className="space-y-0">
                {/* Instruction Item 1 - Heating System Operation */}
                <div className="rounded-lg overflow-hidden">
                  <button
                    onClick={() => setOpenInstructionId(openInstructionId === 'instruction1' ? null : 'instruction1')}
                    className="w-full flex items-center justify-between px-4 py-2 text-left hover:bg-neutral-50 transition-colors"
                  >
                    <span className="text-sm text-neutral-900 font-medium">Heating System Operation</span>
                    <svg
                      className={`h-4 w-4 text-neutral-500 transition-transform ${openInstructionId === 'instruction1' ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openInstructionId === 'instruction1' && (
                    <div className="px-4 pb-4 pt-1">
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        The heating system is controlled by the thermostat on the wall in the living room. Set your desired temperature between 18-24°C. The system will automatically maintain the temperature. For night mode, press the moon button to reduce heating during sleeping hours.
                      </p>
                    </div>
                  )}
                </div>

                {/* Instruction Item 2 - Laundry Instructions */}
                <div className="rounded-lg overflow-hidden">
                  <button
                    onClick={() => setOpenInstructionId(openInstructionId === 'instruction2' ? null : 'instruction2')}
                    className="w-full flex items-center justify-between px-4 py-2 text-left hover:bg-neutral-50 transition-colors"
                  >
                    <span className="text-sm text-neutral-900 font-medium">Laundry Instructions</span>
                    <svg
                      className={`h-4 w-4 text-neutral-500 transition-transform ${openInstructionId === 'instruction2' ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openInstructionId === 'instruction2' && (
                    <div className="px-4 pb-4 pt-1">
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        The washing machine is located in the bathroom. Use the provided detergent pods in the drawer. Select the appropriate program: 30°C for delicates, 40°C for colors, and 60°C for whites. Do not overload the machine. Hang clothes to dry on the drying rack provided in the utility closet.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Right AI Chat Panel */}
      {isChatPanelVisible && (
        <div className="fixed top-0 right-0 bottom-0 w-[420px] z-30 border-l border-neutral-200 bg-white">
          <AIChat context={listing.sku} guestName={listing.name} />
        </div>
      )}
    </div>
  );
}
