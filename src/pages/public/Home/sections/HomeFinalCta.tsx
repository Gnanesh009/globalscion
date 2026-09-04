import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { SUBJECT_IMAGES, img } from '@/api/mock/images';
import { PUBLIC_PATHS } from '@/constants';

export function HomeFinalCta() {
  return (
    <Box
      component="section"
      sx={{ position: 'relative', backgroundColor: 'primary.dark', color: 'common.white', overflow: 'hidden' }}
    >
      <Box
        component="img"
        src={img.wide(SUBJECT_IMAGES.conferenceHall, 1800)}
        alt=""
        aria-hidden
        loading="lazy"
        sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.24 }}
      />
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(11,31,58,0.94) 0%, rgba(6,15,30,0.92) 100%)',
        }}
      />

      <Container sx={{ position: 'relative', py: { xs: 8, md: 13 }, textAlign: 'center' }}>
        <Typography variant="eyebrow" component="p" sx={{ color: 'secondary.light', mb: 2.5 }}>
          Join us
        </Typography>
        <Typography variant="h1" component="h2" sx={{ color: 'common.white', maxWidth: 820, mx: 'auto' }}>
          Join the global scientific community
        </Typography>
        <Typography
          variant="lead"
          component="p"
          sx={{ mt: 3, color: 'rgba(255,255,255,0.74)', maxWidth: 620, mx: 'auto' }}
        >
          Present your research, meet the people working on the same questions, and leave with evidence you
          can apply immediately.
        </Typography>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          justifyContent="center"
          sx={{ mt: 5 }}
        >
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
            to={PUBLIC_PATHS.contact}
            variant="outlined"
            size="large"
            sx={{
              borderColor: 'rgba(255,255,255,0.4)',
              color: 'common.white',
              '&:hover': { borderColor: 'common.white', backgroundColor: 'rgba(255,255,255,0.08)' },
            }}
          >
            Talk to the secretariat
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
