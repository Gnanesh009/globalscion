export * from './paths';
export * from './options';
export * from './navigation';

export const STORAGE_KEYS = {
  accessToken: 'gs.admin.access',
  refreshToken: 'gs.admin.refresh',
  user: 'gs.admin.user',
  sidebarCollapsed: 'gs.admin.sidebar',
  builderDraft: 'gs.admin.builderDraft',
} as const;

export const DEFAULT_PAGE_SIZE = 9;
export const ADMIN_PAGE_SIZE = 10;
