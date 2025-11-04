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
  { value: 'DONE', label: 'Done' },
  { value: 'CANCELLED', label: 'Canceled' },
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
      <DropdownMenuContent align="end" className="bg-white w-48">
        {STATUS_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => {
              if (!disabled || option.value !== 'DONE') {
                onStatusChange(option.value);
                setIsOpen(false);
              }
            }}
            disabled={disabled && option.value === 'DONE'}
            className={`flex items-center justify-between py-2.5 ${
              disabled && option.value === 'DONE' ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span className="text-neutral-900">{option.label}</span>
            {currentStatus === option.value && (
              <svg className="h-4 w-4 text-neutral-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </DropdownMenuItem>
        ))}
        {disabled && disabledMessage && (
          <div className="px-3 py-2 text-xs text-neutral-500 border-t border-neutral-100 mt-1">
            {disabledMessage}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

