import { createTheme, alpha } from '@mui/material/styles';
import { palette, softShadows, transitions } from './tokens';
import { adminTypography } from './typography';

const base = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: palette.blue[600],
      light: palette.blue[500],
      dark: palette.blue[700],
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: palette.navy[800],
      light: palette.navy[600],
      dark: palette.navy[900],
      contrastText: '#FFFFFF',
    },
    info: { main: palette.teal[600] },
    success: { main: palette.green[500], dark: palette.green[600], light: palette.green[100] },
    warning: { main: palette.amber[500], dark: palette.amber[600], light: palette.amber[100] },
    error: { main: palette.red[500], dark: palette.red[600], light: palette.red[100] },
    background: { default: '#F4F6F9', paper: palette.neutral[0] },
    text: {
      primary: palette.neutral[900],
      secondary: palette.neutral[600],
      disabled: palette.neutral[400],
    },
    divider: palette.neutral[200],
  },
  typography: adminTypography,
  shape: { borderRadius: 6 },
  breakpoints: { values: { xs: 0, sm: 480, md: 768, lg: 1024, xl: 1280 } },
});

export const adminTheme = createTheme(base, {
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { WebkitFontSmoothing: 'antialiased' },
        body: { backgroundColor: '#F4F6F9' },
        '::selection': { background: alpha(palette.blue[500], 0.2) },
        '@media (prefers-reduced-motion: reduce)': {
          '*': { animationDuration: '0.01ms !important', transitionDuration: '0.01ms !important' },
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 6,
          minHeight: 40,
          paddingInline: 16,
          transition: `all ${transitions.fast}`,
          '&:focus-visible': { outline: `2px solid ${palette.blue[500]}`, outlineOffset: 2 },
        },
        sizeSmall: { minHeight: 32, paddingInline: 12 },
        sizeLarge: { minHeight: 46 },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { backgroundImage: 'none' },
        outlined: { borderColor: palette.neutral[200] },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: `1px solid ${palette.neutral[200]}`,
          boxShadow: softShadows.xs,
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: { padding: '18px 20px', borderBottom: `1px solid ${palette.neutral[100]}` },
        title: { fontSize: '0.9375rem', fontWeight: 700 },
        subheader: { fontSize: '0.8125rem' },
      },
    },
    MuiCardContent: { styleOverrides: { root: { padding: 20, '&:last-child': { paddingBottom: 20 } } } },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 6, backgroundColor: palette.neutral[0] },
        input: { paddingBlock: 11, fontSize: '0.9375rem' },
        notchedOutline: { borderColor: palette.neutral[300] },
      },
    },
    MuiInputLabel: { styleOverrides: { root: { fontSize: '0.9375rem' } } },
    MuiFormHelperText: { styleOverrides: { root: { marginLeft: 2, fontSize: '0.75rem' } } },
    MuiChip: { styleOverrides: { root: { borderRadius: 5, fontWeight: 600 } } },
    MuiTab: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, minHeight: 46, fontSize: '0.875rem' },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderColor: palette.neutral[100], fontSize: '0.875rem' },
        head: { fontWeight: 700, color: palette.neutral[600], backgroundColor: palette.neutral[50] },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { backgroundColor: palette.neutral[800], fontSize: '0.75rem', borderRadius: 5 },
      },
    },
    MuiDialog: { styleOverrides: { paper: { borderRadius: 10, boxShadow: softShadows.lg } } },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 8,
          border: `1px solid ${palette.neutral[200]}`,
          boxShadow: softShadows.md,
          marginTop: 6,
        },
        list: { paddingBlock: 6 },
      },
    },
    MuiMenuItem: {
      styleOverrides: { root: { fontSize: '0.875rem', borderRadius: 5, marginInline: 6 } },
    },
    MuiListItemIcon: { styleOverrides: { root: { minWidth: 38 } } },
    MuiSkeleton: { defaultProps: { animation: 'wave' } },
  },
});
