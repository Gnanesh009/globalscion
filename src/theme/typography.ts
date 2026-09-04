import type * as React from 'react';
import type { TypographyVariantsOptions } from '@mui/material/styles';
import { fontFamily } from './tokens';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    hero: React.CSSProperties;
    eyebrow: React.CSSProperties;
    lead: React.CSSProperties;
  }
  interface TypographyVariantsOptions {
    hero?: React.CSSProperties;
    eyebrow?: React.CSSProperties;
    lead?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    hero: true;
    eyebrow: true;
    lead: true;
  }
}

export const publicTypography: TypographyVariantsOptions = {
  fontFamily,
  hero: {
    fontFamily,
    fontWeight: 800,
    fontSize: 'clamp(2.5rem, 1.6rem + 3.6vw, 4.25rem)',
    lineHeight: 1.06,
    letterSpacing: '-0.03em',
  },
  h1: {
    fontWeight: 800,
    fontSize: 'clamp(2rem, 1.4rem + 2.4vw, 3.125rem)',
    lineHeight: 1.12,
    letterSpacing: '-0.025em',
  },
  h2: {
    fontWeight: 700,
    fontSize: 'clamp(1.625rem, 1.2rem + 1.6vw, 2.375rem)',
    lineHeight: 1.18,
    letterSpacing: '-0.02em',
  },
  h3: {
    fontWeight: 700,
    fontSize: 'clamp(1.25rem, 1.05rem + 0.8vw, 1.625rem)',
    lineHeight: 1.28,
    letterSpacing: '-0.015em',
  },
  h4: { fontWeight: 700, fontSize: '1.25rem', lineHeight: 1.34, letterSpacing: '-0.01em' },
  h5: { fontWeight: 700, fontSize: '1.0625rem', lineHeight: 1.4 },
  h6: { fontWeight: 700, fontSize: '0.9375rem', lineHeight: 1.45 },
  eyebrow: {
    fontFamily,
    fontWeight: 700,
    fontSize: '0.75rem',
    lineHeight: 1.4,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
  },
  lead: {
    fontFamily,
    fontWeight: 400,
    fontSize: 'clamp(1.0625rem, 1rem + 0.3vw, 1.1875rem)',
    lineHeight: 1.65,
  },
  subtitle1: { fontWeight: 600, fontSize: '1rem', lineHeight: 1.55 },
  subtitle2: { fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.55 },
  body1: { fontWeight: 400, fontSize: '1rem', lineHeight: 1.7 },
  body2: { fontWeight: 400, fontSize: '0.9375rem', lineHeight: 1.65 },
  caption: { fontWeight: 500, fontSize: '0.8125rem', lineHeight: 1.5 },
  overline: {
    fontWeight: 700,
    fontSize: '0.6875rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
  },
  button: { fontWeight: 700, fontSize: '0.9375rem', letterSpacing: '0.01em', textTransform: 'none' },
};

/** Denser scale — an enterprise CMS should fit more on screen. */
export const adminTypography: TypographyVariantsOptions = {
  ...publicTypography,
  hero: { ...publicTypography.hero, fontSize: '2rem' },
  h1: { fontWeight: 700, fontSize: '1.75rem', lineHeight: 1.2, letterSpacing: '-0.02em' },
  h2: { fontWeight: 700, fontSize: '1.375rem', lineHeight: 1.25, letterSpacing: '-0.015em' },
  h3: { fontWeight: 700, fontSize: '1.125rem', lineHeight: 1.3 },
  h4: { fontWeight: 700, fontSize: '1rem', lineHeight: 1.35 },
  h5: { fontWeight: 700, fontSize: '0.9375rem', lineHeight: 1.4 },
  h6: { fontWeight: 700, fontSize: '0.875rem', lineHeight: 1.4 },
  body1: { fontWeight: 400, fontSize: '0.9375rem', lineHeight: 1.6 },
  body2: { fontWeight: 400, fontSize: '0.875rem', lineHeight: 1.55 },
  button: { fontWeight: 600, fontSize: '0.875rem', textTransform: 'none' },
};
