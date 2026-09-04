import { createTheme, alpha } from '@mui/material/styles';
import { palette, softShadows, transitions } from './tokens';
import { publicTypography } from './typography';

const base = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: palette.navy[800],
      light: palette.navy[600],
      dark: palette.navy[900],
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: palette.teal[600],
      light: palette.teal[500],
      dark: palette.teal[700],
      contrastText: '#FFFFFF',
    },
    info: { main: palette.blue[600], light: palette.blue[500], dark: palette.blue[700] },
    success: { main: palette.green[500], dark: palette.green[600], light: palette.green[100] },
    warning: { main: palette.amber[500], dark: palette.amber[600], light: palette.amber[100] },
    error: { main: palette.red[500], dark: palette.red[600], light: palette.red[100] },
    background: { default: palette.neutral[50], paper: palette.neutral[0] },
    text: {
      primary: palette.neutral[900],
      secondary: palette.neutral[600],
      disabled: palette.neutral[400],
    },
    divider: palette.neutral[200],
    grey: {
      50: palette.neutral[50],
      100: palette.neutral[100],
      200: palette.neutral[200],
      300: palette.neutral[300],
      400: palette.neutral[400],
      500: palette.neutral[500],
      600: palette.neutral[600],
      700: palette.neutral[700],
      800: palette.neutral[800],
      900: palette.neutral[900],
    },
  },
  typography: publicTypography,
  shape: { borderRadius: 4 },
  breakpoints: { values: { xs: 0, sm: 480, md: 768, lg: 1024, xl: 1280 } },
});

export const publicTheme = createTheme(base, {
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { WebkitFontSmoothing: 'antialiased', scrollBehavior: 'smooth' },
        body: { backgroundColor: palette.neutral[50], overflowX: 'hidden' },
        '::selection': { background: alpha(palette.teal[500], 0.24) },
        '#root': { minHeight: '100vh', display: 'flex', flexDirection: 'column' },
        'img, svg': { maxWidth: '100%' },
        '@media (prefers-reduced-motion: reduce)': {
          '*': { animationDuration: '0.01ms !important', transitionDuration: '0.01ms !important' },
        },
      },
    },
    MuiContainer: {
      defaultProps: { maxWidth: 'xl' },
      styleOverrides: {
        root: {
          paddingLeft: 20,
          paddingRight: 20,
          [base.breakpoints.up('md')]: { paddingLeft: 40, paddingRight: 40 },
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 4,
          paddingInline: 22,
          minHeight: 46,
          transition: `background-color ${transitions.fast}, color ${transitions.fast}, border-color ${transitions.fast}, transform ${transitions.fast}`,
          '&:focus-visible': {
            outline: `2px solid ${palette.teal[500]}`,
            outlineOffset: 2,
          },
        },
        sizeSmall: { minHeight: 38, paddingInline: 16, fontSize: '0.875rem' },
        sizeLarge: { minHeight: 54, paddingInline: 30, fontSize: '1rem' },
        containedPrimary: {
          '&:hover': { backgroundColor: palette.navy[700] },
        },
        containedSecondary: {
          '&:hover': { backgroundColor: palette.teal[700] },
        },
        outlined: { borderWidth: 1.5, '&:hover': { borderWidth: 1.5 } },
        text: { paddingInline: 8 },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          '&:focus-visible': { outline: `2px solid ${palette.teal[500]}`, outlineOffset: 2 },
        },
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
          backgroundColor: palette.neutral[0],
          transition: `box-shadow ${transitions.base}, transform ${transitions.base}, border-color ${transitions.base}`,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 3, fontWeight: 600, letterSpacing: '0.01em' },
        sizeSmall: { height: 24, fontSize: '0.75rem' },
        outlined: { borderColor: palette.neutral[300] },
      },
    },
    MuiLink: {
      defaultProps: { underline: 'none' },
      styleOverrides: {
        root: {
          transition: `color ${transitions.fast}`,
          '&:focus-visible': { outline: `2px solid ${palette.teal[500]}`, outlineOffset: 3 },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          backgroundColor: palette.neutral[0],
          '& fieldset': { borderColor: palette.neutral[300] },
          '&:hover fieldset': { borderColor: palette.neutral[400] },
        },
        input: { paddingBlock: 14 },
      },
    },
    MuiInputLabel: { styleOverrides: { root: { fontWeight: 600, fontSize: '0.9375rem' } } },
    MuiAccordion: {
      defaultProps: { elevation: 0, disableGutters: true, square: true },
      styleOverrides: {
        root: {
          border: `1px solid ${palette.neutral[200]}`,
          backgroundColor: palette.neutral[0],
          '&:not(:last-of-type)': { borderBottom: 'none' },
          '&::before': { display: 'none' },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: { paddingInline: 20, minHeight: 66 },
        content: { marginBlock: 16 },
      },
    },
    MuiAccordionDetails: { styleOverrides: { root: { paddingInline: 20, paddingBottom: 24 } } },
    MuiTabs: {
      styleOverrides: {
        indicator: { height: 3, backgroundColor: palette.teal[600] },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 700,
          fontSize: '0.9375rem',
          minHeight: 52,
          paddingInline: 4,
          marginRight: 28,
          minWidth: 0,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: palette.navy[800],
          fontSize: '0.75rem',
          fontWeight: 600,
          padding: '8px 12px',
          borderRadius: 4,
        },
        arrow: { color: palette.navy[800] },
      },
    },
    MuiSkeleton: { defaultProps: { animation: 'wave' }, styleOverrides: { root: { borderRadius: 4 } } },
    MuiDivider: { styleOverrides: { root: { borderColor: palette.neutral[200] } } },
    MuiAvatar: { styleOverrides: { root: { fontWeight: 700 } } },
    MuiBreadcrumbs: { styleOverrides: { separator: { color: palette.neutral[400] } } },
    MuiDialog: { styleOverrides: { paper: { borderRadius: 8, boxShadow: softShadows.xl } } },
  },
});
