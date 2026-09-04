import type {
  AbstractStatus,
  ConferenceKind,
  ConferenceSectionType,
  ConferenceStatus,
  EventFormat,
  PublishStatus,
  RegistrationStatus,
  RegistrationType,
  UserRole,
} from '@/types';

export interface Option<T extends string = string> {
  value: T;
  label: string;
}

export const EVENT_FORMAT_OPTIONS: Option<EventFormat>[] = [
  { value: 'physical', label: 'In person' },
  { value: 'online', label: 'Online' },
  { value: 'hybrid', label: 'Hybrid' },
];

export const CONFERENCE_KIND_OPTIONS: Option<ConferenceKind>[] = [
  { value: 'conference', label: 'Conference' },
  { value: 'congress', label: 'World Congress' },
  { value: 'webinar', label: 'Webinar' },
  { value: 'symposium', label: 'Symposium' },
];

export const CONFERENCE_STATUS_OPTIONS: Option<ConferenceStatus>[] = [
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
];

export const PUBLISH_STATUS_OPTIONS: Option<PublishStatus>[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

export const REGISTRATION_TYPE_OPTIONS: Option<RegistrationType>[] = [
  { value: 'delegate', label: 'Delegate' },
  { value: 'speaker', label: 'Speaker' },
  { value: 'student', label: 'Student' },
  { value: 'poster', label: 'Poster presenter' },
  { value: 'e-poster', label: 'E-poster presenter' },
  { value: 'sponsor', label: 'Sponsor / Exhibitor' },
];

export const REGISTRATION_STATUS_OPTIONS: Option<RegistrationStatus>[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
];

export const ABSTRACT_STATUS_OPTIONS: Option<AbstractStatus>[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'under_review', label: 'Under review' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'rejected', label: 'Rejected' },
];

export const USER_ROLE_OPTIONS: Option<UserRole>[] = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
];

export const PRESENTATION_TYPE_OPTIONS: Option[] = [
  { value: 'oral', label: 'Oral presentation' },
  { value: 'poster', label: 'Poster presentation' },
  { value: 'e-poster', label: 'E-poster (virtual)' },
  { value: 'workshop', label: 'Workshop' },
];

export const SESSION_TYPE_OPTIONS: Option[] = [
  { value: 'keynote', label: 'Keynote' },
  { value: 'talk', label: 'Talk' },
  { value: 'panel', label: 'Panel discussion' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'poster', label: 'Poster session' },
  { value: 'break', label: 'Break / Networking' },
];

export const SPONSOR_TIER_OPTIONS: Option[] = [
  { value: 'platinum', label: 'Platinum' },
  { value: 'gold', label: 'Gold' },
  { value: 'silver', label: 'Silver' },
  { value: 'partner', label: 'Collaborating partner' },
  { value: 'media', label: 'Media partner' },
];

/** Section catalogue used by the builder's drag-and-drop step and the renderer. */
export const SECTION_CATALOGUE: {
  type: ConferenceSectionType;
  label: string;
  description: string;
  locked?: boolean;
}[] = [
  { type: 'hero', label: 'Hero', description: 'Title, dates, format, countdown and primary CTAs', locked: true },
  { type: 'event-info', label: 'Event information', description: 'Date, venue, format and deadlines at a glance' },
  { type: 'overview', label: 'Overview', description: 'Welcome message and rich-text introduction' },
  { type: 'themes', label: 'Key themes / tracks', description: 'Scientific sessions and topic areas' },
  { type: 'speakers', label: 'Speakers', description: 'Keynote and invited speaker grid' },
  { type: 'agenda', label: 'Agenda', description: 'Day-by-day programme' },
  { type: 'who-should-attend', label: 'Who should attend', description: 'Target audience list' },
  { type: 'why-attend', label: 'Why attend', description: 'Benefits of attending' },
  { type: 'registration-cta', label: 'Registration', description: 'Registration banner and deadline' },
  { type: 'abstract', label: 'Abstract submission', description: 'Submission guidelines and deadline' },
  { type: 'sponsors', label: 'Sponsors & partners', description: 'Logo wall grouped by tier' },
  { type: 'gallery', label: 'Gallery', description: 'Photographs from previous editions' },
  { type: 'faq', label: 'FAQ', description: 'Frequently asked questions' },
  { type: 'final-cta', label: 'Closing CTA', description: 'Final call to action band' },
];

export const COUNTRIES = [
  'United Kingdom', 'United States', 'India', 'Germany', 'United Arab Emirates',
  'Spain', 'France', 'Italy', 'Netherlands', 'Singapore', 'Japan', 'Australia',
  'Canada', 'Brazil', 'South Africa', 'Switzerland', 'Sweden', 'Portugal',
];

export const TIMEZONES = [
  'UTC', 'Europe/London', 'Europe/Madrid', 'Europe/Berlin', 'Europe/Paris',
  'Asia/Dubai', 'Asia/Kolkata', 'Asia/Singapore', 'Asia/Tokyo',
  'America/New_York', 'America/Chicago', 'America/Los_Angeles', 'Australia/Sydney',
];
