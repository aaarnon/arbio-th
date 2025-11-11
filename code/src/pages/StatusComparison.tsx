import { Badge } from '@/components/ui/badge';
import type { Status } from '@/types/enums';
import { STATUS_STYLES_COLORED, STATUS_STYLES_MONOCHROME } from '@/utils/constants';

/**
 * Status Comparison Demo Page
 * Displays both color schemes side-by-side for design review
 */
export function StatusComparison() {
  const statuses: Status[] = [
    'TODO',
    'IN_REVIEW',
    'IN_PROGRESS',
    'BLOCKED',
    'DONE',
  ];

  const mockCases = [
    { id: 'TK-2847', title: 'Water Leak in Unit A-101 Bathroom', status: 'IN_REVIEW' as Status },
    { id: 'TK-2848', title: 'Guest Refund Request - Cancelled Reservation', status: 'TODO' as Status },
    { id: 'TK-2849', title: 'AC Not Working - Unit B-305', status: 'IN_PROGRESS' as Status },
    { id: 'TK-2850', title: 'Noise Complaint from Neighboring Unit', status: 'DONE' as Status },
    { id: 'TK-2851', title: 'WiFi Connection Issues - Building 3', status: 'BLOCKED' as Status },
    { id: 'TK-2852', title: 'Missing Kitchen Items - Unit D-102', status: 'TODO' as Status },
    { id: 'TK-2853', title: 'Early Check-in Request for VIP Guest', status: 'IN_PROGRESS' as Status },
    { id: 'TK-2854', title: 'Broken Dishwasher - Unit E-201', status: 'TODO' as Status },
  ];

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-neutral-900 mb-2">
            Status Color Scheme Comparison
          </h1>
          <p className="text-sm text-neutral-600">
            Compare both options to decide which works best for your ticketing system
          </p>
        </div>

        {/* Status Badges Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* OPTION 1: Colored */}
          <div className="border border-neutral-200 rounded-lg p-6 bg-neutral-50">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              Option 1: Subtle Colors
            </h2>
            <p className="text-sm text-neutral-600 mb-6">
              Linear-inspired with cool, muted colors. Each status has semantic meaning while maintaining low saturation.
            </p>
            <div className="space-y-3 bg-white p-4 rounded-lg">
              {statuses.map((status) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600 font-medium min-w-[120px]">
                    {status.replace(/_/g, ' ')}
                  </span>
                  <Badge className={STATUS_STYLES_COLORED[status]}>
                    {status.replace(/_/g, ' ')}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2 text-xs text-neutral-600">
              <p><span className="font-medium">✓ Pros:</span> Easy to scan, semantic meaning, modern feel</p>
              <p><span className="font-medium">• Colors:</span> Stone, Amber, Blue, Red, Subtle Green</p>
            </div>
          </div>

          {/* OPTION 2: Monochrome */}
          <div className="border border-neutral-200 rounded-lg p-6 bg-neutral-50">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              Option 2: Monochrome
            </h2>
            <p className="text-sm text-neutral-600 mb-6">
              Pure grey-scale with varying weights. Uses darkness and contrast to create visual hierarchy.
            </p>
            <div className="space-y-3 bg-white p-4 rounded-lg">
              {statuses.map((status) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600 font-medium min-w-[120px]">
                    {status.replace(/_/g, ' ')}
                  </span>
                  <Badge className={STATUS_STYLES_MONOCHROME[status]}>
                    {status.replace(/_/g, ' ')}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2 text-xs text-neutral-600">
              <p><span className="font-medium">✓ Pros:</span> Ultra-minimal, high contrast, bold hierarchy</p>
              <p><span className="font-medium">• Colors:</span> Pure grey-scale only</p>
            </div>
          </div>
        </div>

        {/* Realistic Case List Comparison */}
        <div className="space-y-8">
          <h2 className="text-xl font-semibold text-neutral-900">
            In Context: Case List View
          </h2>

          {/* Option 1: Colored */}
          <div className="border border-neutral-200 rounded-lg overflow-hidden">
            <div className="bg-neutral-100 px-6 py-3 border-b border-neutral-200">
              <h3 className="text-sm font-semibold text-neutral-900">Option 1: Subtle Colors</h3>
            </div>
            <div className="bg-white">
              <table className="w-full">
                <thead className="border-b border-neutral-100">
                  <tr className="text-left">
                    <th className="px-6 py-3 text-xs font-medium text-neutral-500 uppercase">Case ID</th>
                    <th className="px-6 py-3 text-xs font-medium text-neutral-500 uppercase">Title</th>
                    <th className="px-6 py-3 text-xs font-medium text-neutral-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockCases.map((caseItem) => (
                    <tr key={caseItem.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                      <td className="px-6 py-4 text-sm text-neutral-400">{caseItem.id}</td>
                      <td className="px-6 py-4 text-sm text-neutral-900">{caseItem.title}</td>
                      <td className="px-6 py-4">
                        <Badge className={STATUS_STYLES_COLORED[caseItem.status]}>
                          {caseItem.status.replace(/_/g, ' ')}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Option 2: Monochrome */}
          <div className="border border-neutral-200 rounded-lg overflow-hidden">
            <div className="bg-neutral-100 px-6 py-3 border-b border-neutral-200">
              <h3 className="text-sm font-semibold text-neutral-900">Option 2: Monochrome</h3>
            </div>
            <div className="bg-white">
              <table className="w-full">
                <thead className="border-b border-neutral-100">
                  <tr className="text-left">
                    <th className="px-6 py-3 text-xs font-medium text-neutral-500 uppercase">Case ID</th>
                    <th className="px-6 py-3 text-xs font-medium text-neutral-500 uppercase">Title</th>
                    <th className="px-6 py-3 text-xs font-medium text-neutral-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockCases.map((caseItem) => (
                    <tr key={caseItem.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                      <td className="px-6 py-4 text-sm text-neutral-400">{caseItem.id}</td>
                      <td className="px-6 py-4 text-sm text-neutral-900">{caseItem.title}</td>
                      <td className="px-6 py-4">
                        <Badge className={STATUS_STYLES_MONOCHROME[caseItem.status]}>
                          {caseItem.status.replace(/_/g, ' ')}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Design Notes */}
        <div className="mt-12 border border-amber-200 bg-amber-50 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-amber-900 mb-3">🎨 Designer Notes</h3>
          <div className="space-y-2 text-sm text-amber-800">
            <p>
              <strong>Option 1 (Colored):</strong> Provides semantic meaning through color while maintaining sophistication. 
              Quick to scan with active statuses (Blue, Amber, Red) while DONE status uses ultra-subtle green that recedes into the background. 
              Best for users who need fast status recognition without completed items demanding attention.
            </p>
            <p>
              <strong>Option 2 (Monochrome):</strong> Ultra-minimal and creates strong visual hierarchy through weight. 
              More subtle but requires slightly more cognitive effort. Best for extremely minimal aesthetic.
            </p>
            <p className="mt-4 pt-3 border-t border-amber-200">
              <strong>Recommendation:</strong> Option 1 (Subtle Colors) offers better usability while staying true to 
              your Linear-inspired minimalist design. The colors are muted enough to feel sophisticated yet distinct 
              enough for quick scanning.
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-neutral-100 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-neutral-900 mb-3">How to Switch</h3>
          <p className="text-sm text-neutral-700 mb-4">
            To change the active theme across your entire app, edit <code className="bg-white px-2 py-1 rounded text-xs">src/utils/constants.ts</code>:
          </p>
          <div className="bg-white rounded-lg p-4 font-mono text-xs">
            <div className="text-neutral-600">// Change this line:</div>
            <div className="text-neutral-900 mt-1">
              export const ACTIVE_STATUS_THEME: 'colored' | 'monochrome' = <span className="text-blue-600">'colored'</span>;
            </div>
            <div className="text-neutral-600 mt-2">// To:</div>
            <div className="text-neutral-900 mt-1">
              export const ACTIVE_STATUS_THEME: 'colored' | 'monochrome' = <span className="text-blue-600">'monochrome'</span>;
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

