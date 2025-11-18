import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MultiSelectProps {
  options: { label: string; value: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Multi-select dropdown component with checkboxes
 * Allows users to select multiple options from a list
 */
export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = 'Select options',
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleToggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const handleSelectAll = () => {
    if (selected.length === options.length) {
      onChange([]);
    } else {
      onChange(options.map((option) => option.value));
    }
  };

  const getDisplayText = () => {
    if (selected.length === 0) {
      return placeholder;
    }
    if (selected.length === options.length) {
      return `All (${selected.length})`;
    }
    if (selected.length === 1) {
      const selectedOption = options.find((opt) => opt.value === selected[0]);
      return selectedOption?.label || placeholder;
    }
    return `${selected.length} selected`;
  };

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'flex w-full items-center justify-between whitespace-nowrap rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 transition-colors duration-150 focus:outline-none focus:border-neutral-800 disabled:cursor-not-allowed disabled:opacity-50 h-9',
            className
          )}
        >
          <span className="truncate">{getDisplayText()}</span>
          <svg
            className="ml-2 h-4 w-4 shrink-0 text-neutral-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          className="w-[var(--radix-popover-trigger-width)] p-0 bg-white border border-neutral-200 rounded-md shadow-md z-50"
          align="start"
          sideOffset={4}
        >
          <div className="max-h-[300px] overflow-y-auto">
            {/* Select All Option */}
            <div
              className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-neutral-50 border-b border-neutral-100"
              onClick={handleSelectAll}
            >
              <div
                className={cn(
                  'h-4 w-4 border rounded flex items-center justify-center',
                  selected.length === options.length
                    ? 'bg-neutral-900 border-neutral-900'
                    : 'border-neutral-300'
                )}
              >
                {selected.length === options.length && (
                  <Check className="h-3 w-3 text-white" strokeWidth={3} />
                )}
              </div>
              <span className="text-sm font-medium">
                {selected.length === options.length ? 'Deselect All' : 'Select All'}
              </span>
            </div>

            {/* Individual Options */}
            {options.map((option) => {
              const isSelected = selected.includes(option.value);
              return (
                <div
                  key={option.value}
                  className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-neutral-50"
                  onClick={() => handleToggle(option.value)}
                >
                  <div
                    className={cn(
                      'h-4 w-4 border rounded flex items-center justify-center',
                      isSelected
                        ? 'bg-neutral-900 border-neutral-900'
                        : 'border-neutral-300'
                    )}
                  >
                    {isSelected && (
                      <Check className="h-3 w-3 text-white" strokeWidth={3} />
                    )}
                  </div>
                  <span className="text-sm">{option.label}</span>
                </div>
              );
            })}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

