import { format, formatDistanceToNow, parseISO } from 'date-fns';

/**
 * Format a date string to a readable date format
 * @param dateString - ISO date string
 * @returns Formatted date string (e.g., "Nov 2, 2025")
 * @example formatDate("2025-11-02T10:30:00Z") // "Nov 2, 2025"
 */
export function formatDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, 'MMM d, yyyy');
  } catch (error) {
    return dateString;
  }
}

/**
 * Format a date string to a time format
 * @param dateString - ISO date string
 * @returns Formatted time string (e.g., "10:30 AM")
 * @example formatTime("2025-11-02T10:30:00Z") // "10:30 AM"
 */
export function formatTime(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, 'h:mm a');
  } catch (error) {
    return dateString;
  }
}

/**
 * Format a date string to include both date and time
 * @param dateString - ISO date string
 * @returns Formatted date and time string (e.g., "Nov 2, 2025 10:30 AM")
 * @example formatDateTime("2025-11-02T10:30:00Z") // "Nov 2, 2025 10:30 AM"
 */
export function formatDateTime(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, 'MMM d, yyyy h:mm a');
  } catch (error) {
    return dateString;
  }
}

/**
 * Format a date string to a relative time format
 * @param dateString - ISO date string
 * @returns Relative time string (e.g., "2 hours ago", "3 days ago")
 * @example formatRelativeDate("2025-11-02T08:30:00Z") // "2 hours ago"
 */
export function formatRelativeDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    return dateString;
  }
}

/**
 * Format a date string to a short numeric date format
 * @param dateString - ISO date string
 * @returns Formatted date string (e.g., "11/02/2025")
 * @example formatShortDate("2025-11-02T10:30:00Z") // "11/02/2025"
 */
export function formatShortDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, 'MM/dd/yyyy');
  } catch (error) {
    return dateString;
  }
}

