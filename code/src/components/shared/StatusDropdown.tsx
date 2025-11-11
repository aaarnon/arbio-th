import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface StatusOption {
  value: string;
  label: string;
  isSeparator?: boolean;
}

interface StatusDropdownProps {
  currentStatus: string;
  onStatusChange: (status: string) => void;
  disabled?: boolean;
  disabledMessage?: string;
  trigger: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const STATUS_OPTIONS: StatusOption[] = [
  { value: 'TODO', label: 'To Do' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'IN_REVIEW', label: 'In Review' },
  { value: 'DONE', label: 'Done' },
  { value: 'separator-1', label: '', isSeparator: true },
  { value: 'BLOCKED', label: 'Blocked' },
  { value: 'FAILED', label: 'Failed' },
  { value: 'DUPLICATE', label: 'Duplicate' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

/**
 * Shared Status Dropdown Component
 * Consistent status selection across tasks and case headers
 */
export function StatusDropdown({
  currentStatus,
  onStatusChange,
  disabled = false,
  disabledMessage,
  trigger,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
}: StatusDropdownProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  
  // Use external control if provided, otherwise use internal state
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const setIsOpen = externalOnOpenChange || setInternalOpen;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white rounded-lg shadow-lg border border-neutral-200 py-2 w-48">
        {STATUS_OPTIONS.map((option) => {
          if (option.isSeparator) {
            return <div key={option.value} className="my-1 h-px bg-neutral-200" />;
          }
          
          return (
            <div key={option.value}>
            <DropdownMenuItem
              onClick={() => {
                if (!disabled || option.value !== 'DONE') {
                  onStatusChange(option.value);
                  setIsOpen(false);
                }
              }}
              disabled={disabled && option.value === 'DONE'}
              className={`flex items-center justify-between px-3 py-1.5 text-sm hover:bg-neutral-50 transition-colors focus:bg-neutral-50 rounded-none ${
                disabled && option.value === 'DONE' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              <span className="text-neutral-900">{option.label}</span>
              {currentStatus === option.value && (
                <svg className="h-4 w-4 text-neutral-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </DropdownMenuItem>
              {option.value === 'DONE' && disabled && disabledMessage && (
                <div className="px-3 -mt-1 pb-1 text-[9px] text-neutral-500 italic">
                  {disabledMessage}
                </div>
              )}
            </div>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

