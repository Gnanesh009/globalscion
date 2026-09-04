import type { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { ADMIN_PATHS } from '@/constants';

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumb?: { label: string; href?: string }[];
}

export function AdminPageHeader({ title, description, actions, breadcrumb }: AdminPageHeaderProps) {
  return (
    <Box sx={{ mb: 3 }}>
      {breadcrumb && (
        <Breadcrumbs
          separator={<NavigateNextIcon sx={{ fontSize: 14 }} />}
          aria-label="Breadcrumb"
          sx={{ mb: 1.5, fontSize: '0.8125rem' }}
        >
          <Box
            component={RouterLink}
            to={ADMIN_PATHS.dashboard}
            sx={{ color: 'text.secondary', textDecoration: 'none' }}
          >
            Dashboard
          </Box>
          {breadcrumb.map((crumb) =>
            crumb.href ? (
              <Box
                key={crumb.label}
                component={RouterLink}
                to={crumb.href}
                sx={{ color: 'text.secondary', textDecoration: 'none' }}
              >
                {crumb.label}
              </Box>
            ) : (
              <Typography key={crumb.label} sx={{ fontSize: '0.8125rem', color: 'text.primary', fontWeight: 600 }}>
                {crumb.label}
              </Typography>
            ),
          )}
        </Breadcrumbs>
      )}

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', md: 'center' }}
        spacing={2}
      >
        <Box>
          <Typography variant="h1" component="h1">
            {title}
          </Typography>
          {description && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, maxWidth: 760 }}>
              {description}
            </Typography>
          )}
        </Box>
        {actions && (
          <Stack direction="row" spacing={1.25} sx={{ flexShrink: 0 }}>
            {actions}
          </Stack>
        )}
      </Stack>
    </Box>
  );
}
