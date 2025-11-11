import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCaseContext } from '@/store/CaseContext';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Command Palette Modal - Clarity/Linear-inspired search
 * Quick access to navigation and search functionality
 */
export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { state } = useCaseContext();

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [open, onClose]);

  if (!open) return null;

  // Filter cases based on search
  const filteredCases = state.cases.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.ticketCode.toLowerCase().includes(search.toLowerCase())
  );

  const handleItemClick = (action: () => void) => {
    action();
    onClose();
    setSearch('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-2xl border border-neutral-200 overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-200">
          <svg className="h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type a command or search..."
            className="flex-1 text-base outline-none placeholder:text-neutral-400"
            autoFocus
          />
          <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs font-medium text-neutral-500 bg-neutral-100 rounded">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {!search && (
            <div className="p-8 text-center text-sm text-neutral-500">
              Start typing to search cases...
            </div>
          )}

          {search && filteredCases.length > 0 && (
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-semibold text-neutral-500 uppercase">
                Cases
              </div>
              {filteredCases.slice(0, 5).map((caseItem) => (
                <button
                  key={caseItem.id}
                  onClick={() => handleItemClick(() => navigate(`/cases/${caseItem.id}`))}
                  className="flex items-start gap-3 w-full px-3 py-2.5 rounded-md hover:bg-neutral-100 transition-colors"
                >
                  <svg className="h-5 w-5 text-neutral-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <div className="flex-1 text-left">
                    <div className="text-sm text-neutral-900">{caseItem.title}</div>
                    <div className="text-xs text-neutral-500">{caseItem.ticketCode}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {search && filteredCases.length === 0 && (
            <div className="p-8 text-center text-sm text-neutral-500">
              No results found for "{search}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

