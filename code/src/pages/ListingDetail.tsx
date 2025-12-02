import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockListings, type Listing } from '@/data/mockListings';
import { mockCases } from '@/data/mockCases';
import { ListingSidebar } from '@/components/shared/ListingSidebar';
import { Badge } from '@/components/ui/badge';
import { Plus, ArrowLeft } from 'lucide-react';

export function ListingDetail() {
  const { listingId } = useParams<{ listingId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [listing, setListing] = useState<Listing | null>(null);

  useEffect(() => {
    // Find the listing by ID
    const foundListing = mockListings.find(l => l.id === listingId);
    if (foundListing) {
      setListing(foundListing);
    } else {
      // If listing not found, redirect back to listings
      navigate('/listings');
    }
  }, [listingId, navigate]);

  if (!listing) {
    return null;
  }

  // Get all tickets for this listing
  const listingTickets = mockCases
    .filter(c => c.propertyId === listing.id)
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
    { id: 'contracts', label: 'Contracts' },
    { id: 'custom-fields', label: 'Custom Fields' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Main Content - With right margin for sidebar */}
      <div className="mr-[380px] w-full px-8 pt-6">
        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-neutral-900 hover:text-neutral-600 transition-colors"
            aria-label="Back to previous page"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold text-neutral-900">{listing.sku}</h1>
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

                {/* AI Sentiment */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-neutral-500">AI Sentiment:</span>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {listing.aiSentiment}
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2: Tickets */}
            <div className="bg-white rounded-lg pt-6 px-6 pb-2 mb-6">
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

            {/* Section 3: Sanity Check */}
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
            {/* Section 1: Property Handbook */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-neutral-900">Property Handbook</h2>
                <button className="text-xs text-neutral-600 px-2 py-1 rounded hover:bg-neutral-100 transition-colors">
                  Edit
                </button>
              </div>
              <div className="space-y-4">
                {/* Emergency Contacts */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-neutral-900">Emergency Contacts</span>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-neutral-500">Property Manager:</span>
                      <span className="text-xs text-neutral-900">+49 30 1234 5678</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-neutral-500">Emergency Services:</span>
                      <span className="text-xs text-neutral-900">112</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-neutral-500">Police:</span>
                      <span className="text-xs text-neutral-900">110</span>
                    </div>
                  </div>
                </div>

                {/* House Rules */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-neutral-900">House Rules</span>
                  <ul className="space-y-1.5 ml-4">
                    <li className="text-xs text-neutral-600 flex items-start gap-2">
                      <span className="text-neutral-400 mt-0.5">•</span>
                      <span>Check-in: 3:00 PM - Check-out: 11:00 AM</span>
                    </li>
                    <li className="text-xs text-neutral-600 flex items-start gap-2">
                      <span className="text-neutral-400 mt-0.5">•</span>
                      <span>No smoking inside the property</span>
                    </li>
                    <li className="text-xs text-neutral-600 flex items-start gap-2">
                      <span className="text-neutral-400 mt-0.5">•</span>
                      <span>Quiet hours: 10:00 PM - 8:00 AM</span>
                    </li>
                    <li className="text-xs text-neutral-600 flex items-start gap-2">
                      <span className="text-neutral-400 mt-0.5">•</span>
                      <span>Pets not allowed</span>
                    </li>
                  </ul>
                </div>

                {/* Garbage & Recycling */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-neutral-900">Garbage & Recycling</span>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Separate waste bins are located in the kitchen. Please sort: Paper (blue), Plastic (yellow), Glass (white), and Organic waste (brown). General waste goes in the grey bin.
                  </p>
                </div>

                {/* Parking */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-neutral-900">Parking</span>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Free street parking available on Hauptstraße. Parking garage entrance at Nebenstraße 12. Use code 2404 for access.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2: Profile */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-neutral-900">Profile</h2>
                <button className="text-xs text-neutral-600 px-2 py-1 rounded hover:bg-neutral-100 transition-colors">
                  Edit
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-500">Property Type:</span>
                  <span className="text-xs text-neutral-900">Apartment</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-500">Bedrooms:</span>
                  <span className="text-xs text-neutral-900">2</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-500">Bathrooms:</span>
                  <span className="text-xs text-neutral-900">1</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-500">Max Guests:</span>
                  <span className="text-xs text-neutral-900">4</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-500">Size:</span>
                  <span className="text-xs text-neutral-900">65 m²</span>
                </div>
              </div>
            </div>

            {/* Section 2: Extra-services */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-neutral-900">Extra-services</h2>
                <button className="text-xs text-neutral-600 px-2 py-1 rounded hover:bg-neutral-100 transition-colors">
                  Edit
                </button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-500">Airport Transfer:</span>
                  <span className="text-xs text-green-700">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-500">Late Check-in:</span>
                  <span className="text-xs text-green-700">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-500">Early Check-in:</span>
                  <span className="text-xs text-amber-700">On Request</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-500">Cleaning Service:</span>
                  <span className="text-xs text-green-700">Available</span>
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
              </div>
            </div>

            {/* Section 4: Specific Instructions */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-neutral-900">SPECIFIC INSTRUCTIONS</h2>
                <button className="text-xs text-neutral-600 px-2 py-1 rounded hover:bg-neutral-100 transition-colors">
                  Edit
                </button>
              </div>
              <div className="space-y-4">
                {/* Heating System Operation */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-neutral-900">Heating System Operation</span>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    The heating system is controlled by the thermostat on the wall in the living room. Set your desired temperature between 18-24°C. The system will automatically maintain the temperature. For night mode, press the moon button to reduce heating during sleeping hours.
                  </p>
                </div>

                {/* Laundry Instructions */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-neutral-900">Laundry Instructions</span>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    The washing machine is located in the bathroom. Use the provided detergent pods in the drawer. Select the appropriate program: 30°C for delicates, 40°C for colors, and 60°C for whites. Do not overload the machine. Hang clothes to dry on the drying rack provided in the utility closet.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contracts Tab Content */}
        {activeTab === 'contracts' && (
          <div className="w-full max-w-[50.16rem]">
            {/* Section 1: Mandatory Contracts */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <h2 className="text-base font-semibold text-neutral-900 uppercase tracking-wider mb-4">Mandatory Contracts</h2>
              
              {/* Contract List */}
              <div className="space-y-0">
                {/* Rental Contract */}
                <div className="group flex items-center gap-2 py-1.5 px-2 hover:bg-neutral-50 rounded-md transition-colors">
                  {/* PDF Icon */}
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

                  {/* Contract Name */}
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-neutral-800 truncate">
                      Rental contract
                    </span>
                  </div>

                  {/* Download Button (shows on hover) */}
                  <button
                    onClick={() => window.open('#', '_blank')}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-neutral-500 hover:text-neutral-800"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                  </button>
                </div>

                {/* Vodafone Contract */}
                <div className="group flex items-center gap-2 py-1.5 px-2 hover:bg-neutral-50 rounded-md transition-colors">
                  {/* PDF Icon */}
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

                  {/* Contract Name */}
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-neutral-800 truncate">
                      Vodafone contract
                    </span>
                  </div>

                  {/* Download Button (shows on hover) */}
                  <button
                    onClick={() => window.open('#', '_blank')}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-neutral-500 hover:text-neutral-800"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                  </button>
                </div>

                {/* Property Management Contract */}
                <div className="group flex items-center gap-2 py-1.5 px-2 hover:bg-neutral-50 rounded-md transition-colors">
                  {/* PDF Icon */}
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

                  {/* Contract Name */}
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-neutral-800 truncate">
                      Property management contract
                    </span>
                  </div>

                  {/* Download Button (shows on hover) */}
                  <button
                    onClick={() => window.open('#', '_blank')}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-neutral-500 hover:text-neutral-800"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Add Attachment Button */}
              <button
                onClick={() => {/* In a real app, this would open a file picker */}}
                className="flex items-center justify-center gap-2 py-1.5 px-2 text-xs text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50 rounded-md transition-colors w-full mt-1"
              >
                <Plus className="h-3.5 w-3.5" />
                Add attachment
              </button>
            </div>

            {/* Section 2: Others */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <h2 className="text-base font-semibold text-neutral-900 uppercase tracking-wider mb-4">Others</h2>
              
              {/* Contract List */}
              <div className="space-y-0">
                {/* Breakfast Delivery Contract */}
                <div className="group flex items-center gap-2 py-1.5 px-2 hover:bg-neutral-50 rounded-md transition-colors">
                  {/* PDF Icon */}
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

                  {/* Contract Name */}
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-neutral-800 truncate">
                      Breakfast Delivery contract
                    </span>
                  </div>

                  {/* Download Button (shows on hover) */}
                  <button
                    onClick={() => window.open('#', '_blank')}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-neutral-500 hover:text-neutral-800"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Add Attachment Button */}
              <button
                onClick={() => {/* In a real app, this would open a file picker */}}
                className="flex items-center justify-center gap-2 py-1.5 px-2 text-xs text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50 rounded-md transition-colors w-full mt-1"
              >
                <Plus className="h-3.5 w-3.5" />
                Add attachment
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
      </div>

      {/* Right Sidebar - Fixed, Full-Height, Edge-to-Edge */}
      <div className="fixed top-0 right-0 bottom-0 w-[380px] z-30">
        <ListingSidebar listing={listing} />
      </div>
    </div>
  );
}

