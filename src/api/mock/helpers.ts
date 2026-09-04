import type { Paginated } from '@/types';

/** Simulated network latency so loading skeletons are exercised in development. */
export const latency = (min = 220, max = 520) =>
  new Promise<void>((resolve) => setTimeout(resolve, min + Math.random() * (max - min)));

export async function respond<T>(data: T, minMs?: number, maxMs?: number): Promise<T> {
  await latency(minMs, maxMs);
  return structuredClone(data);
}

export class MockHttpError extends Error {
  status: number;
  fieldErrors?: Record<string, string[]>;

  constructor(status: number, message: string, fieldErrors?: Record<string, string[]>) {
    super(message);
    this.name = 'MockHttpError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export async function reject(status: number, message: string, fieldErrors?: Record<string, string[]>): Promise<never> {
  await latency(150, 320);
  throw new MockHttpError(status, message, fieldErrors);
}

export function paginate<T>(items: T[], page = 1, pageSize = 10): Paginated<T> {
  const safePage = Math.max(1, page);
  const start = (safePage - 1) * pageSize;
  const results = items.slice(start, start + pageSize);
  return {
    count: items.length,
    next: start + pageSize < items.length ? `?page=${safePage + 1}` : null,
    previous: safePage > 1 ? `?page=${safePage - 1}` : null,
    results,
  };
}

export function matchesSearch(term: string | undefined, ...fields: (string | null | undefined)[]) {
  if (!term?.trim()) return true;
  const needle = term.trim().toLowerCase();
  return fields.some((field) => field?.toLowerCase().includes(needle));
}

export function sortBy<T>(items: T[], ordering: string | undefined, fallback?: (a: T, b: T) => number): T[] {
  if (!ordering) return fallback ? [...items].sort(fallback) : items;
  const desc = ordering.startsWith('-');
  const key = (desc ? ordering.slice(1) : ordering) as keyof T;
  return [...items].sort((a, b) => {
    const av = a[key];
    const bv = b[key];
    if (av === bv) return 0;
    const result = (av as never) > (bv as never) ? 1 : -1;
    return desc ? -result : result;
  });
}
