import type { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { HERO_IMAGES, img } from '@/api/mock/images';
import { Logo } from '@/components/common/Logo';
import { PUBLIC_PATHS } from '@/constants';

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

const HIGHLIGHTS = [
  'Publish a conference and its public page goes live instantly',
  'Configure page sections per conference with drag and drop',
  'Track registrations, abstracts and delegate reviews in one place',
];

/** Split-screen authentication shell shared by login, forgot and reset. */
export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <Grid container sx={{ minHeight: '100vh' }}>
      <Grid
        size={{ xs: 12, lg: 6 }}
        sx={{ display: 'flex', alignItems: 'center', backgroundColor: 'background.paper' }}
      >
        <Container maxWidth="sm" sx={{ py: { xs: 6, md: 8 } }}>
          <Box component={RouterLink} to={PUBLIC_PATHS.home} sx={{ display: 'inline-block', mb: 6 }}>
            <Logo showTagline />
          </Box>

          <Typography variant="h1" component="h1" sx={{ fontSize: '1.875rem' }}>
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1.5, mb: 4 }}>
            {subtitle}
          </Typography>

          {children}

          {footer && <Box sx={{ mt: 4 }}>{footer}</Box>}
        </Container>
      </Grid>

      <Grid
        size={{ lg: 6 }}
        sx={{
          display: { xs: 'none', lg: 'flex' },
          position: 'relative',
          alignItems: 'center',
          backgroundColor: '#0B1F3A',
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={img.wide(HERO_IMAGES.lecture, 1400)}
          alt=""
          aria-hidden
          sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.24 }}
        />
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(140deg, rgba(6,15,30,0.94) 0%, rgba(11,31,58,0.86) 100%)',
          }}
        />
        <Box sx={{ position: 'relative', px: 8, color: 'common.white' }}>
          <Typography variant="eyebrow" sx={{ color: 'info.light' }}>
            GlobalScion CMS
          </Typography>
          <Typography variant="h2" sx={{ color: 'common.white', mt: 2, fontSize: '2rem' }}>
            The content system behind every conference page
          </Typography>
          <Stack spacing={2} sx={{ mt: 4 }}>
            {HIGHLIGHTS.map((item) => (
              <Stack key={item} direction="row" spacing={1.5} alignItems="flex-start">
                <CheckCircleOutlineIcon sx={{ fontSize: 18, color: 'info.light', mt: 0.3 }} />
                <Typography sx={{ color: 'rgba(255,255,255,0.76)' }}>{item}</Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      </Grid>
    </Grid>
  );
}
