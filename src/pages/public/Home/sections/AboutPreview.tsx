import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckIcon from '@mui/icons-material/Check';
import { SUBJECT_IMAGES, img } from '@/api/mock/images';
import { Section } from '@/components/common/Section';
import { PUBLIC_PATHS } from '@/constants';

const COMMITMENTS = [
  'Independent peer review with published assessment criteria',
  'Student rates and low- and middle-income country bursaries',
  'Captioning, accessible venues and dietary provision as standard',
  'Recordings and certificates delivered on schedule, every time',
];

export function AboutPreview() {
  return (
    <Section>
      <Grid container spacing={{ xs: 5, lg: 9 }} alignItems="center">
        <Grid size={{ xs: 12, lg: 6 }}>
          {/* Offset image pair — editorial composition rather than a plain photo block */}
          <Box sx={{ position: 'relative', pr: { md: 7 }, pb: { md: 7 } }}>
            <Box
              component="img"
              src={img.card(SUBJECT_IMAGES.discussion, 900)}
              alt="Delegates in discussion during a GlobalScion conference session"
              loading="lazy"
              sx={{ width: '100%', borderRadius: 1, display: 'block', aspectRatio: '4 / 3', objectFit: 'cover' }}
            />
            <Box
              component="img"
              src={img.card(SUBJECT_IMAGES.laboratory, 600)}
              alt=""
              aria-hidden
              loading="lazy"
              sx={{
                display: { xs: 'none', md: 'block' },
                position: 'absolute',
                right: 0,
                bottom: 0,
                width: '46%',
                aspectRatio: '1 / 1',
                objectFit: 'cover',
                borderRadius: 1,
                border: '6px solid',
                borderColor: 'background.default',
              }}
            />
          </Box>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <Typography variant="eyebrow" component="p" sx={{ color: 'secondary.main', mb: 2 }}>
            About GlobalScion
          </Typography>
          <Typography variant="h2" component="h2">
            A gateway to global scientific collaboration
          </Typography>
          <Typography variant="lead" component="p" sx={{ mt: 2.5, color: 'text.secondary' }}>
            We were founded on a simple observation: most international conferences are organised around
            commercial logistics rather than scientific value. GlobalScion was built to do the opposite —
            open calls, independent review and a programme that reflects where a field is actually heading.
          </Typography>

          <Stack spacing={1.75} sx={{ mt: 4 }}>
            {COMMITMENTS.map((item) => (
              <Stack key={item} direction="row" spacing={1.75} alignItems="flex-start">
                <Box
                  aria-hidden
                  sx={{
                    mt: 0.3,
                    flexShrink: 0,
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    display: 'grid',
                    placeItems: 'center',
                    backgroundColor: 'rgba(14,124,134,0.12)',
                    color: 'secondary.dark',
                  }}
                >
                  <CheckIcon sx={{ fontSize: 14 }} />
                </Box>
                <Typography sx={{ fontWeight: 500 }}>{item}</Typography>
              </Stack>
            ))}
          </Stack>

          <Button
            component={RouterLink}
            to={PUBLIC_PATHS.about}
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{ mt: 4.5 }}
          >
            More about us
          </Button>
        </Grid>
      </Grid>
    </Section>
  );
}
