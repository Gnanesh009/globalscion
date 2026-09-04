import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(advancedFormat);
dayjs.extend(relativeTime);

export const formatDate = (value?: string | null, template = 'DD MMM YYYY') =>
  value ? dayjs(value).format(template) : '—';

export const formatDateTime = (value?: string | null) =>
  value ? dayjs(value).format('DD MMM YYYY, HH:mm') : '—';

export const fromNow = (value?: string | null) => (value ? dayjs(value).fromNow() : '—');

/** "17–18 September 2026" / "29 September – 2 October 2026" / "12 March 2026" */
export function formatDateRange(start?: string | null, end?: string | null): string {
  if (!start) return '—';
  const from = dayjs(start);
  const to = end ? dayjs(end) : null;
  if (!to || from.isSame(to, 'day')) return from.format('DD MMMM YYYY');
  if (from.isSame(to, 'month')) return `${from.format('DD')}–${to.format('DD MMMM YYYY')}`;
  if (from.isSame(to, 'year')) return `${from.format('DD MMMM')} – ${to.format('DD MMMM YYYY')}`;
  return `${from.format('DD MMM YYYY')} – ${to.format('DD MMM YYYY')}`;
}

export const formatLocation = (city?: string, country?: string) =>
  [city, country].filter(Boolean).join(', ') || 'Online';

export const formatNumber = (value: number) => new Intl.NumberFormat('en-GB').format(value);

export const formatCurrency = (value: number, currency = 'USD') =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value);

export function formatBytes(bytes: number): string {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** i).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export const initialsOf = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

/** Strips HTML so rich text can be reused inside meta descriptions and previews. */
export function stripHtml(html: string, maxLength?: number): string {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (!maxLength || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

export function daysUntil(date?: string | null): number | null {
  if (!date) return null;
  return dayjs(date).startOf('day').diff(dayjs().startOf('day'), 'day');
}
