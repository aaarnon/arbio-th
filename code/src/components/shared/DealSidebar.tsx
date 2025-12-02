import type { Deal } from '@/types/deal';

interface DealSidebarProps {
  deal: Deal;
}

/**
 * Deal Sidebar Component
 * Displays deal basic information in the right panel
 */
export function DealSidebar({ deal }: DealSidebarProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <aside className="h-full overflow-y-auto bg-white border-l border-neutral-200">
      {/* Basic Information */}
      <section className="px-8 py-8 border-b border-neutral-100">
        <h3 className="text-xs font-medium text-neutral-900 uppercase tracking-wider mb-4">
          Basic Information
        </h3>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <dt className="text-xs text-neutral-500">Deal ID</dt>
            <dd className="text-xs text-neutral-900 font-medium">{deal.id}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-xs text-neutral-500">Deal SKU</dt>
            <dd className="text-xs text-neutral-900 font-medium">{deal.sku}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-xs text-neutral-500">Name</dt>
            <dd className="text-xs text-neutral-900">{deal.name}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-xs text-neutral-500">Date Signed</dt>
            <dd className="text-xs text-neutral-900">{formatDate(deal.dateSigned)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-xs text-neutral-500">Owner</dt>
            <dd className="text-xs text-neutral-900">{deal.owner}</dd>
          </div>
        </div>
      </section>
    </aside>
  );
}

