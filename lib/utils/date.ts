/**
 * Safe date calculation and formatting utilities compatible with Next.js 16 App Router prerendering.
 *
 * @module date
 */

/**
 * Calculates human-readable relative time difference from today to the specified YYYY-MM-DD date.
 *
 * @param dateStr - ISO date string in YYYY-MM-DD format.
 * @returns Human-friendly string (e.g. "12 days away", "Today!", "Passed") or original string on invalid input.
 */
export function calculateDaysUntil(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-').map(Number);
    if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) {
      return dateStr;
    }
    const target = new Date(parts[0], parts[1] - 1, parts[2]).getTime();
    const today = new Date().setHours(0, 0, 0, 0);
    const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
    if (diff < 0) return 'Passed';
    if (diff === 0) return 'Today!';
    return `${diff} days away`;
  } catch (_error: unknown) {
    // Graceful fallback to original string if date parsing encounters unexpected input
    return dateStr;
  }
}

/**
 * Safely extracts the date portion from an ISO string, ensuring SSR compatibility without hydration mismatch.
 *
 * @param isoString - An optional ISO datetime string.
 * @returns A safe string representation of the date (YYYY-MM-DD) or an empty string.
 */
export function formatDateSafe(isoString?: string): string {
  if (!isoString) return '';
  return isoString.split('T')[0] || isoString;
}
