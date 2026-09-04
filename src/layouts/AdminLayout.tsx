import { Suspense, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import { ThemeProvider } from '@mui/material/styles';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { SessionExpiredDialog } from '@/components/admin/SessionExpiredDialog';
import { LoadingScreen } from '@/components/common/States';
import { ScrollToTop } from '@/components/common/ScrollToTop';
import { STORAGE_KEYS } from '@/constants';
import { useDashboard } from '@/hooks/useResources';
import { adminTheme, layout } from '@/theme';
import { storage } from '@/utils/storage';

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(() =>
    storage.get<boolean>(STORAGE_KEYS.sidebarCollapsed, false),
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: dashboard } = useDashboard();

  const width = collapsed ? layout.adminSidebarCollapsed : layout.adminSidebarWidth;

  const toggle = () => {
    setCollapsed((prev) => {
      storage.set(STORAGE_KEYS.sidebarCollapsed, !prev);
      return !prev;
    });
  };

  return (
    <ThemeProvider theme={adminTheme}>
      <CssBaseline />
      <ScrollToTop />
      <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
        {/* Permanent sidebar — desktop */}
        <Box
          component="nav"
          aria-label="Admin"
          sx={{
            width,
            flexShrink: 0,
            display: { xs: 'none', lg: 'block' },
            transition: 'width 220ms cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              bottom: 0,
              width,
              transition: 'width 220ms cubic-bezier(0.4,0,0.2,1)',
              zIndex: (theme) => theme.zIndex.drawer,
            }}
          >
            <AdminSidebar collapsed={collapsed} />
          </Box>
        </Box>

        {/* Temporary drawer — tablet and mobile */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', lg: 'none' } }}
          PaperProps={{ sx: { width: layout.adminSidebarWidth, border: 'none' } }}
        >
          <AdminSidebar collapsed={false} onNavigate={() => setMobileOpen(false)} />
        </Drawer>

        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <AdminTopbar
            collapsed={collapsed}
            onToggleSidebar={toggle}
            onOpenMobileNav={() => setMobileOpen(true)}
            pendingCount={dashboard?.stats.abstracts ? Math.min(dashboard.stats.abstracts, 99) : 0}
          />
          <Box component="main" sx={{ flex: 1, p: { xs: 2, md: 3 }, minWidth: 0 }}>
            <Suspense fallback={<LoadingScreen />}>
              <Outlet />
            </Suspense>
          </Box>
        </Box>
      </Box>
      <SessionExpiredDialog />
    </ThemeProvider>
  );
}
