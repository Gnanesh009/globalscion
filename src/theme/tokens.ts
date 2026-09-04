/**
 * Single source of truth for the GlobalScion visual language.
 * Both the public and admin themes are derived from these tokens so the two
 * surfaces stay related without ever looking alike.
 */
export const palette = {
  navy: {
    900: '#060F1E',
    800: '#0B1F3A',
    700: '#12294B',
    600: '#1B3A67',
    500: '#294F86',
    100: '#E8EDF5',
    50: '#F2F5FA',
  },
  teal: {
    700: '#0A5D66',
    600: '#0E7C86',
    500: '#14A2AE',
    100: '#DFF3F4',
    50: '#F0FAFA',
  },
  blue: {
    700: '#1D4ED8',
    600: '#2563EB',
    500: '#3B82F6',
    100: '#DCE7FE',
  },
  neutral: {
    900: '#16181D',
    800: '#272B33',
    700: '#3C424E',
    600: '#5A6474',
    500: '#7B8494',
    400: '#A3ABB8',
    300: '#CBD1DA',
    200: '#E4E7EC',
    100: '#EFF1F5',
    50: '#F7F8FA',
    0: '#FFFFFF',
  },
  amber: { 600: '#B45309', 500: '#D97706', 100: '#FEF0DC' },
  green: { 600: '#047857', 500: '#059669', 100: '#D9F2E8' },
  red: { 600: '#B91C1C', 500: '#DC2626', 100: '#FDE3E3' },
} as const;

export const fontFamily =
  '"Manrope", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif';

/** Soft, low-contrast elevation. Replaces MUI's default 25-step shadow ramp. */
export const softShadows = {
  xs: '0 1px 2px rgba(11, 31, 58, 0.05)',
  sm: '0 2px 8px rgba(11, 31, 58, 0.06)',
  md: '0 8px 24px rgba(11, 31, 58, 0.08)',
  lg: '0 20px 48px rgba(11, 31, 58, 0.12)',
  xl: '0 32px 80px rgba(11, 31, 58, 0.16)',
} as const;

export const layout = {
  containerMaxWidth: 1280,
  headerHeight: 88,
  headerHeightCompact: 68,
  adminSidebarWidth: 268,
  adminSidebarCollapsed: 76,
  adminTopbarHeight: 64,
  sectionPaddingY: { xs: 7, md: 12 },
} as const;

export const transitions = {
  fast: '160ms cubic-bezier(0.4, 0, 0.2, 1)',
  base: '240ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '420ms cubic-bezier(0.16, 1, 0.3, 1)',
} as const;
