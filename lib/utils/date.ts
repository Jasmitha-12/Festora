/**
 * Safe date calculation utilities compatible with Next.js 16 App Router prerendering
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
  } catch {
    return dateStr;
  }
}

export function formatDateSafe(isoString?: string): string {
  if (!isoString) return '';
  return isoString.split('T')[0] || isoString;
}
