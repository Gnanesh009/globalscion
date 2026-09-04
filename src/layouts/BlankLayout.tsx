import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { LoadingScreen } from '@/components/common/States';
import { adminTheme } from '@/theme';

/** Chromeless shell for authentication and error pages. */
export default function BlankLayout() {
  return (
    <ThemeProvider theme={adminTheme}>
      <CssBaseline />
      <Suspense fallback={<LoadingScreen />}>
        <Outlet />
      </Suspense>
    </ThemeProvider>
  );
}
