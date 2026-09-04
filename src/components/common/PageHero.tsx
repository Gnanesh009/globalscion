import type { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { PUBLIC_PATHS } from '@/constants';

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Background photograph URL. Falls back to the flat navy band. */
  image?: string;
  breadcrumb?: { label: string; href?: string }[];
  children?: ReactNode;
}

export function PageHero({ eyebrow, title, description, image, breadcrumb, children }: PageHeroProps) {
  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        backgroundColor: 'primary.dark',
        color: 'common.white',
        overflow: 'hidden',
      }}
    >
      {image && (
        <>
          <Box
            component="img"
            src={image}
            alt=""
            aria-hidden
            sx={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.3,
            }}
          />
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(100deg, rgba(6,15,30,0.95) 0%, rgba(11,31,58,0.8) 100%)',
            }}
          />
        </>
      )}

      <Container sx={{ position: 'relative', py: { xs: 6, md: 10 } }}>
        {breadcrumb && (
          <Breadcrumbs
            separator={<NavigateNextIcon sx={{ fontSize: 15 }} />}
            aria-label="Breadcrumb"
            sx={{ mb: 3, fontSize: '0.8125rem', color: 'rgba(255,255,255,0.6)' }}
          >
            <Box
              component={RouterLink}
              to={PUBLIC_PATHS.home}
              sx={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', '&:hover': { color: 'common.white' } }}
            >
              Home
            </Box>
            {breadcrumb.map((crumb) =>
              crumb.href ? (
                <Box
                  key={crumb.label}
                  component={RouterLink}
                  to={crumb.href}
                  sx={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', '&:hover': { color: 'common.white' } }}
                >
                  {crumb.label}
                </Box>
              ) : (
                <Typography key={crumb.label} component="span" sx={{ fontSize: '0.8125rem', color: 'common.white' }}>
                  {crumb.label}
                </Typography>
              ),
            )}
          </Breadcrumbs>
        )}

        {eyebrow && (
          <Typography variant="eyebrow" component="p" sx={{ color: 'secondary.light', mb: 2 }}>
            {eyebrow}
          </Typography>
        )}

        <Typography variant="h1" component="h1" sx={{ color: 'common.white', maxWidth: 900 }}>
          {title}
        </Typography>

        {description && (
          <Typography
            variant="lead"
            component="p"
            sx={{ mt: 2.5, maxWidth: 680, color: 'rgba(255,255,255,0.74)' }}
          >
            {description}
          </Typography>
        )}

        {children}
      </Container>
    </Box>
  );
}
