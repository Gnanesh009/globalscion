import type {
  AbstractSubmission,
  AdminUser,
  Category,
  Conference,
  MediaAsset,
  Registration,
  Review,
  SitePage,
  SiteSettings,
  Speaker,
  Sponsor,
} from '@/types';
import { categories as seedCategories } from './data/categories';
import { conferences as seedConferences } from './data/conferences';
import { reviews as seedReviews } from './data/reviews';
import { sponsors as seedSponsors } from './data/shared';
import { speakers as seedSpeakers } from './data/speakers';
import { abstracts as seedAbstracts, registrations as seedRegistrations } from './data/transactions';
import { media as seedMedia, pages as seedPages, settings as seedSettings, users as seedUsers } from './data/site';

/**
 * In-memory store. Mutations made through the admin portal persist for the
 * lifetime of the browser tab, which is enough to exercise every CRUD flow
 * without a backend. Replaced wholesale once VITE_USE_MOCK is false.
 */
export const db: {
  categories: Category[];
  conferences: Conference[];
  speakers: Speaker[];
  sponsors: Sponsor[];
  reviews: Review[];
  registrations: Registration[];
  abstracts: AbstractSubmission[];
  media: MediaAsset[];
  users: AdminUser[];
  pages: SitePage[];
  settings: SiteSettings;
} = {
  categories: structuredClone(seedCategories),
  conferences: structuredClone(seedConferences),
  speakers: structuredClone(seedSpeakers),
  sponsors: structuredClone(seedSponsors),
  reviews: structuredClone(seedReviews),
  registrations: structuredClone(seedRegistrations),
  abstracts: structuredClone(seedAbstracts),
  media: structuredClone(seedMedia),
  users: structuredClone(seedUsers),
  pages: structuredClone(seedPages),
  settings: structuredClone(seedSettings),
};

export const nextId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`;
