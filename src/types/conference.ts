import type { PublishStatus, SeoMeta } from './common';

export type EventFormat = 'online' | 'physical' | 'hybrid';
export type ConferenceKind = 'conference' | 'congress' | 'webinar' | 'symposium';
export type ConferenceStatus = 'upcoming' | 'ongoing' | 'completed';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string | null;
  color: string | null;
  conference_count: number;
  display_order: number;
  status: PublishStatus;
}

export interface Speaker {
  id: string;
  name: string;
  photo: string | null;
  designation: string;
  institution: string;
  country: string;
  biography: string;
  website: string | null;
  linkedin: string | null;
  status: PublishStatus;
  is_keynote?: boolean;
}

export interface AgendaSession {
  id: string;
  time_start: string;
  time_end: string;
  title: string;
  description: string;
  session_type: 'keynote' | 'panel' | 'workshop' | 'break' | 'talk' | 'poster';
  speaker_ids: string[];
  display_order: number;
}

export interface AgendaDay {
  id: string;
  day_number: number;
  date: string;
  title: string;
  sessions: AgendaSession[];
}

export interface Sponsor {
  id: string;
  name: string;
  logo: string | null;
  website: string | null;
  description: string;
  tier: 'platinum' | 'gold' | 'silver' | 'partner' | 'media';
  status: PublishStatus;
}

export interface GalleryImage {
  id: string;
  image: string;
  caption: string;
  display_order: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  display_order: number;
}

export interface KeyTheme {
  id: string;
  title: string;
  description: string;
  display_order: number;
}

/**
 * Section descriptor returned by the API. `type` drives the component registry,
 * `order` drives placement, `enabled` drives visibility. Unknown types are
 * ignored by the renderer so the backend can ship new sections independently.
 */
export type ConferenceSectionType =
  | 'hero'
  | 'event-info'
  | 'overview'
  | 'themes'
  | 'speakers'
  | 'agenda'
  | 'who-should-attend'
  | 'why-attend'
  | 'registration-cta'
  | 'abstract'
  | 'sponsors'
  | 'gallery'
  | 'faq'
  | 'final-cta';

export interface ConferenceSection {
  type: ConferenceSectionType;
  enabled: boolean;
  order: number;
  /** Optional per-section overrides (heading, eyebrow, background variant). */
  config?: Record<string, unknown>;
}

export interface ConferenceListItem {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  category: Pick<Category, 'id' | 'name' | 'slug'>;
  kind: ConferenceKind;
  event_format: EventFormat;
  start_date: string;
  end_date: string;
  timezone: string;
  city: string;
  country: string;
  venue: string;
  hero_image: string | null;
  card_image: string | null;
  status: ConferenceStatus;
  publish_status: PublishStatus;
  is_featured: boolean;
  speaker_count: number;
  updated_at: string;
}

export interface Conference extends ConferenceListItem {
  /** Rich text (HTML) authored in the admin editor. */
  description: string;
  theme_line: string;
  hero_subtitle: string;
  hero_cta_label: string;
  hero_cta_url: string;
  brochure_url: string | null;
  registration_url: string | null;
  abstract_deadline: string | null;
  registration_deadline: string | null;
  key_themes: KeyTheme[];
  speakers: Speaker[];
  agenda: AgendaDay[];
  sponsors: Sponsor[];
  gallery: GalleryImage[];
  faqs: FaqItem[];
  who_should_attend: string[];
  why_attend: string[];
  sections: ConferenceSection[];
  seo: SeoMeta;
}

export interface ConferenceQuery {
  page?: number;
  page_size?: number;
  search?: string;
  category?: string;
  status?: ConferenceStatus | 'all';
  kind?: ConferenceKind | 'all';
  format?: EventFormat | 'all';
  publish_status?: PublishStatus | 'all';
  date_from?: string;
  date_to?: string;
  featured?: boolean;
  ordering?: string;
}
