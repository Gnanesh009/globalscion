import { PUBLIC_PATHS } from './paths';

export interface NavItem {
  label: string;
  href: string;
  /** Marks the Conferences/Webinar entry that opens the mega menu. */
  megaMenu?: boolean;
}

export const PRIMARY_NAV: NavItem[] = [
  { label: 'About', href: PUBLIC_PATHS.about },
  { label: 'Conferences / Webinars', href: PUBLIC_PATHS.conferences, megaMenu: true },
  { label: 'Reviews', href: PUBLIC_PATHS.reviews },
  { label: 'Contact Us', href: PUBLIC_PATHS.contact },
];

export const FOOTER_QUICK_LINKS: NavItem[] = [
  { label: 'Home', href: PUBLIC_PATHS.home },
  { label: 'About GlobalScion', href: PUBLIC_PATHS.about },
  { label: 'All Conferences', href: PUBLIC_PATHS.conferences },
  { label: 'Delegate Reviews', href: PUBLIC_PATHS.reviews },
  { label: 'Contact Us', href: PUBLIC_PATHS.contact },
];

export const FOOTER_LEGAL_LINKS: NavItem[] = [
  { label: 'Privacy Policy', href: PUBLIC_PATHS.privacy },
  { label: 'Terms & Conditions', href: PUBLIC_PATHS.terms },
];
