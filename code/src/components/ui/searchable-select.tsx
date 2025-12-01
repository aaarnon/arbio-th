import * as React from "react"
import { cn } from "@/lib/utils"
import { CheckIcon } from "@radix-ui/react-icons"

export interface SearchableSelectOption {
  value: string
  label: string
}

interface SearchableSelectProps {
  value?: string
  onValueChange: (value: string) => void
  options: SearchableSelectOption[]
  placeholder?: string
  className?: string
}

/**
 * SearchableSelect Component
 * Linear-inspired searchable dropdown with filtering
 */
export function SearchableSelect({
  value,
  onValueChange,
  options,
  placeholder = "Search...",
  className,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const containerRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Filter options based on search query
  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) return options
    const query = searchQuery.toLowerCase()
    return options.filter((option) =>
      option.label.toLowerCase().includes(query) ||
      option.value.toLowerCase().includes(query)
    )
  }, [options, searchQuery])

  // Get display label for selected value
  const selectedOption = options.find((opt) => opt.value === value)
  const displayLabel = selectedOption?.label || ""

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
        // Don't clear search query - keep it for next search
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open])

  const handleSelect = (optionValue: string) => {
    onValueChange(optionValue)
    setOpen(false)
    setSearchQuery("") // Clear search query after selection
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSearchQuery(newValue)
    // Automatically open dropdown after typing 5 or more characters
    if (newValue.length >= 5) {
      setOpen(true)
    } else if (newValue.length < 5 && open) {
      setOpen(false)
    }
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setOpen(true)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch()
    }
  }

  const handleInputFocus = () => {
    // Clear the displayed value on focus to allow searching
    if (displayLabel && !searchQuery) {
      setSearchQuery("")
    }
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Search Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchQuery || displayLabel}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className={cn(
            "flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 pr-10 text-sm text-neutral-800 transition-colors duration-150 placeholder:text-neutral-300 focus-visible:outline-none focus-visible:border-neutral-800 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
        />
        <button
          type="button"
          onClick={handleSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-800 transition-colors"
        >
          <svg
            className="h-4 w-4"
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
        </button>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-neutral-200 bg-white shadow-lg">
          {filteredOptions.length === 0 ? (
            <div className="px-3 py-2 text-sm text-neutral-500">
              No results found
            </div>
          ) : (
            <div className="p-1">
              {filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    "relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 pl-3 pr-9 text-sm text-neutral-800 outline-none transition-colors hover:bg-neutral-100",
                    value === option.value && "bg-neutral-50"
                  )}
                >
                  <span className="flex-1 text-left">{option.label}</span>
                  {value === option.value && (
                    <span className="absolute right-3 flex h-3.5 w-3.5 items-center justify-center">
                      <CheckIcon className="h-4 w-4 text-neutral-800" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

