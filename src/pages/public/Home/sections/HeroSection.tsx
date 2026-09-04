import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import { HERO_IMAGES, img } from '@/api/mock/images';
import { PUBLIC_PATHS } from '@/constants';

const TRUST_POINTS = [
  ['500+', 'Conferences delivered'],
  ['50+', 'Countries represented'],
  ['10k+', 'Delegates hosted'],
];

export function HeroSection() {
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
      <Box
        component="img"
        src={img.wide(HERO_IMAGES.globalCollaboration, 2000)}
        alt=""
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.38,
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(105deg, rgba(6,15,30,0.96) 0%, rgba(11,31,58,0.88) 45%, rgba(11,31,58,0.42) 100%)',
        }}
      />

      <Container sx={{ position: 'relative' }}>
        <Grid container>
          <Grid size={{ xs: 12, lg: 9, xl: 8 }} sx={{ py: { xs: 9, md: 16 } }}>
            <Typography variant="eyebrow" component="p" sx={{ color: 'secondary.light', mb: 3 }}>
              International scientific &amp; medical conferences
            </Typography>

            <Typography variant="hero" component="h1">
              Where Ideas Meet
              <Box component="span" sx={{ display: 'block', color: 'secondary.light' }}>
                Action — Globally
              </Box>
            </Typography>

            <Typography
              variant="lead"
              component="p"
              sx={{ mt: 3.5, maxWidth: 640, color: 'rgba(255,255,255,0.76)' }}
            >
              GlobalScion convenes researchers, clinicians and industry leaders across more than fifty
              countries. Every programme is built from an open call for abstracts and reviewed by an
              independent scientific committee — no pay-to-speak slots, no sponsor-written sessions.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 5 }}>
              <Button
                component={RouterLink}
                to={PUBLIC_PATHS.conferences}
                variant="contained"
                color="secondary"
                size="large"
                endIcon={<ArrowForwardIcon />}
              >
                Explore conferences
              </Button>
              <Button
                component={RouterLink}
                to={`${PUBLIC_PATHS.conferences}?status=upcoming`}
                variant="outlined"
                size="large"
                startIcon={<UploadFileOutlinedIcon />}
                sx={{
                  borderColor: 'rgba(255,255,255,0.42)',
                  color: 'common.white',
                  '&:hover': { borderColor: 'common.white', backgroundColor: 'rgba(255,255,255,0.08)' },
                }}
              >
                Submit abstract
              </Button>
            </Stack>

            <Stack
              direction="row"
              spacing={{ xs: 3, md: 6 }}
              sx={{ mt: { xs: 6, md: 9 }, pt: 4, borderTop: '1px solid rgba(255,255,255,0.14)' }}
              flexWrap="wrap"
              useFlexGap
            >
              {TRUST_POINTS.map(([value, label]) => (
                <Box key={label}>
                  <Typography
                    component="span"
                    sx={{ display: 'block', fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}
                  >
                    {value}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.55)' }}>
                    {label}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
