import type { ReactNode } from 'react';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import RecordVoiceOverOutlinedIcon from '@mui/icons-material/RecordVoiceOverOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import PhotoLibraryOutlinedIcon from '@mui/icons-material/PhotoLibraryOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import PermMediaOutlinedIcon from '@mui/icons-material/PermMediaOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { ADMIN_PATHS } from '@/constants';
import type { UserRole } from '@/types';

export interface AdminNavChild {
  label: string;
  href: string;
  /** Query string appended to the parent route, used for status-filtered views. */
  exact?: boolean;
}

export interface AdminNavItem {
  label: string;
  href: string;
  icon: ReactNode;
  children?: AdminNavChild[];
  /** Minimum role able to see this entry. Omit for everyone. */
  roles?: UserRole[];
  badgeKey?: 'registrations' | 'abstracts';
}

export interface AdminNavSection {
  heading: string;
  items: AdminNavItem[];
}

export const ADMIN_NAV: AdminNavSection[] = [
  {
    heading: 'Overview',
    items: [{ label: 'Dashboard', href: ADMIN_PATHS.dashboard, icon: <DashboardOutlinedIcon /> }],
  },
  {
    heading: 'Content',
    items: [
      {
        label: 'Conferences',
        href: ADMIN_PATHS.conferences,
        icon: <EventNoteOutlinedIcon />,
        children: [
          { label: 'All conferences', href: ADMIN_PATHS.conferences, exact: true },
          { label: 'Add conference', href: ADMIN_PATHS.conferenceNew },
          { label: 'Drafts', href: `${ADMIN_PATHS.conferences}?status=draft` },
          { label: 'Published', href: `${ADMIN_PATHS.conferences}?status=published` },
          { label: 'Archived', href: `${ADMIN_PATHS.conferences}?status=archived` },
        ],
      },
      { label: 'Categories', href: ADMIN_PATHS.categories, icon: <CategoryOutlinedIcon /> },
      { label: 'Speakers', href: ADMIN_PATHS.speakers, icon: <RecordVoiceOverOutlinedIcon /> },
      { label: 'Agenda', href: ADMIN_PATHS.agenda, icon: <ScheduleOutlinedIcon /> },
      { label: 'Sponsors', href: ADMIN_PATHS.sponsors, icon: <HandshakeOutlinedIcon /> },
      { label: 'Gallery', href: ADMIN_PATHS.gallery, icon: <PhotoLibraryOutlinedIcon /> },
      { label: 'Reviews', href: ADMIN_PATHS.reviews, icon: <StarBorderOutlinedIcon /> },
    ],
  },
  {
    heading: 'Delegates',
    items: [
      {
        label: 'Registrations',
        href: ADMIN_PATHS.registrations,
        icon: <HowToRegOutlinedIcon />,
        badgeKey: 'registrations',
      },
      {
        label: 'Abstract submissions',
        href: ADMIN_PATHS.abstracts,
        icon: <DescriptionOutlinedIcon />,
        badgeKey: 'abstracts',
      },
    ],
  },
  {
    heading: 'Site',
    items: [
      { label: 'Pages', href: ADMIN_PATHS.pages, icon: <ArticleOutlinedIcon /> },
      { label: 'Media library', href: ADMIN_PATHS.media, icon: <PermMediaOutlinedIcon /> },
      { label: 'Users', href: ADMIN_PATHS.users, icon: <GroupOutlinedIcon />, roles: ['admin'] },
      { label: 'Settings', href: ADMIN_PATHS.settings, icon: <SettingsOutlinedIcon />, roles: ['admin'] },
    ],
  },
];
