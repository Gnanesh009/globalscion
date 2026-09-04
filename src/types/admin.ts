import type { PublishStatus, SeoMeta } from './common';

export type UserRole = 'super_admin' | 'admin' | 'editor';

export interface AdminUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  avatar: string | null;
  is_active: boolean;
  last_login: string | null;
  date_joined: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  remember?: boolean;
}

export interface LoginResponse extends AuthTokens {
  user: AdminUser;
}

export interface Review {
  id: string;
  name: string;
  designation: string;
  organization: string;
  country: string;
  photo: string | null;
  review: string;
  rating: number;
  conference: string | null;
  status: PublishStatus;
  created_at: string;
}

export type RegistrationType =
  | 'delegate'
  | 'speaker'
  | 'student'
  | 'poster'
  | 'e-poster'
  | 'sponsor';

export type RegistrationStatus = 'pending' | 'confirmed' | 'cancelled' | 'refunded';

export interface Registration {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  conference: string;
  conference_slug: string;
  registration_type: RegistrationType;
  country: string;
  amount: number;
  currency: string;
  status: RegistrationStatus;
  created_at: string;
}

export type AbstractStatus = 'pending' | 'under_review' | 'accepted' | 'rejected';

export interface AbstractSubmission {
  id: string;
  author_name: string;
  email: string;
  conference: string;
  conference_slug: string;
  title: string;
  institution: string;
  country: string;
  presentation_type: 'oral' | 'poster' | 'e-poster' | 'workshop';
  file_url: string | null;
  status: AbstractStatus;
  submitted_at: string;
}

export interface SitePage {
  id: string;
  slug: 'about' | 'contact' | 'terms-and-conditions' | 'privacy-policy';
  title: string;
  hero_subtitle: string;
  content: string;
  seo: SeoMeta;
  status: PublishStatus;
  updated_at: string;
}

export interface SiteSettings {
  website_name: string;
  tagline: string;
  logo: string | null;
  favicon: string | null;
  contact_email: string;
  support_email: string;
  phone: string;
  address: string;
  offices: { country: string; address: string }[];
  social: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    youtube: string;
  };
  footer_description: string;
  default_seo: SeoMeta;
}

export interface DashboardStats {
  total_conferences: number;
  published: number;
  drafts: number;
  upcoming: number;
  registrations: number;
  abstracts: number;
  speakers: number;
  archived: number;
  registrations_delta: number;
  abstracts_delta: number;
  conferences_delta: number;
  speakers_delta: number;
}

export interface TrendPoint {
  period: string;
  registrations: number;
  abstracts: number;
  conferences: number;
}

export interface ActivityEntry {
  id: string;
  actor: string;
  action: string;
  target: string;
  target_type: 'conference' | 'speaker' | 'review' | 'registration' | 'abstract' | 'page';
  created_at: string;
}

export interface DashboardResponse {
  stats: DashboardStats;
  trends: TrendPoint[];
  category_distribution: { name: string; value: number }[];
  activity: ActivityEntry[];
}

export interface ContactMessage {
  full_name: string;
  email: string;
  phone: string;
  subject: string;
  conference?: string;
  message: string;
}
