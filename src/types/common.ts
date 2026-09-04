/**
 * Envelope shapes mirroring Django REST Framework defaults so that swapping the
 * mock adapter for the live API is a configuration change, not a refactor.
 */
export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ListParams {
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
}

/** DRF validation errors: `{ field: ["message"], non_field_errors: [...] }` */
export type ApiFieldErrors = Record<string, string[]>;

export interface ApiError {
  status: number;
  message: string;
  fieldErrors?: ApiFieldErrors;
}

export type PublishStatus = 'draft' | 'published' | 'archived';

export interface MediaAsset {
  id: string;
  url: string;
  thumbnail_url: string | null;
  alt_text: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  width: number | null;
  height: number | null;
  uploaded_at: string;
  uploaded_by: string | null;
}

export interface SeoMeta {
  meta_title: string;
  meta_description: string;
  og_image: string | null;
  canonical_url?: string | null;
  keywords?: string[];
}
