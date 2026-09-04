import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { LoadingScreen } from '@/components/common/States';
import { ScrollToTop } from '@/components/common/ScrollToTop';
import { publicTheme } from '@/theme';

export default function PublicLayout() {
  return (
    <ThemeProvider theme={publicTheme}>
      <CssBaseline />
      <ScrollToTop />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Box component="main" id="main-content" sx={{ flex: 1 }}>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}
