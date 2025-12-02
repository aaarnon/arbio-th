import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockDeals } from '@/data/mockDeals';
import { mockListings } from '@/data/mockListings';
import { DealSidebar } from '@/components/shared/DealSidebar';
import { ArrowLeft, ChevronRight, Plus } from 'lucide-react';
import type { Deal } from '@/types/deal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { SearchableSelect } from '@/components/ui/searchable-select';
import type { SearchableSelectOption } from '@/components/ui/searchable-select';

export function DealDetail() {
  const { dealId } = useParams<{ dealId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [deal, setDeal] = useState<Deal | null>(null);
  const [isAddApartmentModalOpen, setIsAddApartmentModalOpen] = useState(false);
  const [selectedApartmentSku, setSelectedApartmentSku] = useState<string>('');
  const [relatedListings, setRelatedListings] = useState<typeof mockListings>([]);

  useEffect(() => {
    // Find the deal by ID
    const foundDeal = mockDeals.find(d => d.id === dealId);
    if (foundDeal) {
      setDeal(foundDeal);
      setRelatedListings(mockListings.filter(listing => listing.dealSku === foundDeal.sku));
    } else {
      // If deal not found, redirect back to deals
      navigate('/deals');
    }
  }, [dealId, navigate]);

  const handleAddApartment = () => {
    if (!selectedApartmentSku || !deal) return;
    
    // Find the listing by SKU
    const listingToAdd = mockListings.find(listing => listing.sku === selectedApartmentSku);
    if (listingToAdd) {
      // Update the listing's dealSku to associate it with this deal
      listingToAdd.dealSku = deal.sku;
      // Update local state
      setRelatedListings([...relatedListings, listingToAdd]);
      // Reset form
      setSelectedApartmentSku('');
      setIsAddApartmentModalOpen(false);
    }
  };

  if (!deal) {
    return null;
  }

  // Get all available apartment SKUs (excluding already added ones)
  const availableListings = mockListings.filter(
    listing => listing.dealSku !== deal.sku
  );
  
  const apartmentOptions: SearchableSelectOption[] = availableListings.map(listing => ({
    value: listing.sku,
    label: `${listing.name} (${listing.sku})`,
  }));

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'documents', label: 'Documents' },
    { id: 'performance', label: 'Performance' },
  ];

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusColor = (status: string) => {
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
          <h1 className="text-xl font-bold text-neutral-900">{deal.name}</h1>
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
            {/* Section 1: Deal Summary */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <h2 className="text-base font-semibold text-neutral-900 mb-4">Deal Summary</h2>
              <div className="space-y-3">
                {/* Status */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-500">Status:</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(deal.status)}`}>
                    {formatStatusLabel(deal.status)}
                  </span>
                </div>

                {/* Value */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-500">Deal Value:</span>
                  <span className="text-sm font-medium text-neutral-900">
                    {formatCurrency(deal.value, deal.currency)}
                  </span>
                </div>

                {/* Owner */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-500">Deal Owner:</span>
                  <span className="text-xs text-neutral-900">{deal.owner}</span>
                </div>
              </div>
            </div>

            {/* Section 2: Listing Related */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <h2 className="text-base font-semibold text-neutral-900 mb-4">Listing Related</h2>
              {relatedListings.length > 0 ? (
                <div className="overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-neutral-200">
                        <th className="text-left py-2 px-0 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Apartment
                        </th>
                        <th className="text-left py-2 px-0 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          SKU
                        </th>
                        <th className="w-6"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {relatedListings.map((listing) => (
                        <tr
                          key={listing.id}
                          onClick={() => navigate(`/listings/${listing.id}`)}
                          className="border-b border-neutral-100 hover:bg-neutral-50 cursor-pointer transition-colors"
                        >
                          <td className="py-2.5 px-0">
                            <span className="text-sm text-neutral-900">{listing.name}</span>
                          </td>
                          <td className="py-2.5 px-0">
                            <span className="text-sm text-neutral-600">{listing.sku}</span>
                          </td>
                          <td className="py-2.5 px-0">
                            <ChevronRight className="h-4 w-4 text-neutral-400" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-sm text-neutral-500 py-4 text-center">
                  No listings found for this deal
                </div>
              )}
              
              {/* Add Apartment Button */}
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => setIsAddApartmentModalOpen(true)}
                  className="flex items-center gap-2 text-xs text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Apartment</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Documents Tab Content */}
        {activeTab === 'documents' && (
          <div className="w-full max-w-[50.16rem]">
            <div className="bg-white rounded-lg p-6 mb-6">
              <h2 className="text-base font-semibold text-neutral-900 mb-4">Documents</h2>
              <div className="text-sm text-neutral-500 py-4 text-center">
                Deal documents will be displayed here
              </div>
            </div>
          </div>
        )}

        {/* Performance Tab Content */}
        {activeTab === 'performance' && (
          <div className="w-full max-w-[50.16rem]">
            <div className="bg-white rounded-lg p-6 mb-6">
              <h2 className="text-base font-semibold text-neutral-900 mb-4">Performance Metrics</h2>
              <div className="text-sm text-neutral-500 py-4 text-center">
                Deal performance metrics and analytics will be displayed here
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar - Fixed, Full-Height, Edge-to-Edge */}
      <div className="fixed top-0 right-0 bottom-0 w-[380px] z-30">
        <DealSidebar deal={deal} />
      </div>

      {/* Add Apartment Modal */}
      <Dialog open={isAddApartmentModalOpen} onOpenChange={setIsAddApartmentModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Apartment</DialogTitle>
            <DialogDescription>
              Search and select an apartment by SKU to add to this deal
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <label className="text-sm font-medium text-neutral-900 mb-2 block">
              Apartment SKU
            </label>
            <SearchableSelect
              value={selectedApartmentSku}
              onValueChange={setSelectedApartmentSku}
              options={apartmentOptions}
              placeholder="Search by apartment name or SKU..."
              className="w-full"
            />
          </div>

          <DialogFooter>
            <button
              onClick={() => {
                setIsAddApartmentModalOpen(false);
                setSelectedApartmentSku('');
              }}
              className="px-4 py-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddApartment}
              disabled={!selectedApartmentSku}
              className="px-4 py-2 text-sm font-medium text-white bg-neutral-900 rounded-md hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Apartment
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

