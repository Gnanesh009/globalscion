import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Section } from '@/components/common/Section';
import { REGISTRATION_TYPE_OPTIONS } from '@/constants';
import { daysUntil, formatDate } from '@/utils/format';
import type { ConferenceSectionProps } from './types';

const TIER_INCLUSIONS: Record<string, string[]> = {
  delegate: ['Access to all sessions', 'Certificate of participation', 'Book of abstracts', '30-day session recordings'],
  student: ['Verified student rate', 'Access to all sessions', 'Mentorship session', 'Certificate of participation'],
  'e-poster': ['Virtual poster listing', 'Citable abstract record', 'Certificate of presentation', 'Session recordings'],
};

export function RegistrationCTA({ conference }: ConferenceSectionProps) {
  const closed = conference.status === 'completed';
  const daysLeft = daysUntil(conference.registration_deadline);

  return (
    <Section tone="surface" id="registration">
      <Box
        sx={{
          borderRadius: 1,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Grid container>
          <Grid
            size={{ xs: 12, lg: 5 }}
            sx={{ backgroundColor: 'primary.dark', color: 'common.white', p: { xs: 3.5, md: 5 } }}
          >
            <Typography variant="eyebrow" component="p" sx={{ color: 'secondary.light', mb: 2 }}>
              Registration
            </Typography>
            <Typography variant="h2" component="h2" sx={{ color: 'common.white' }}>
              {closed ? 'This edition has concluded' : 'Secure your place'}
            </Typography>
            <Typography variant="body1" sx={{ mt: 2, color: 'rgba(255,255,255,0.72)' }}>
              {closed
                ? 'Proceedings and session recordings remain available to registered delegates. Register your interest for the next edition.'
                : `Registration closes on ${formatDate(conference.registration_deadline)}. Group rates apply from five delegates, and verified students receive a reduced fee.`}
            </Typography>

            {!closed && daysLeft !== null && daysLeft > 0 && (
              <Box
                sx={{
                  display: 'inline-block',
                  mt: 3,
                  px: 2,
                  py: 1,
                  borderRadius: 0.75,
                  backgroundColor: 'rgba(20,162,174,0.18)',
                  border: '1px solid rgba(20,162,174,0.4)',
                }}
              >
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 700 }}>
                  {daysLeft} days left to register
                </Typography>
              </Box>
            )}

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 4 }}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                href={conference.registration_url ?? '#registration'}
                disabled={closed}
              >
                {closed ? 'Registration closed' : 'Register now'}
              </Button>
              <Button
                variant="outlined"
                size="large"
                href="/contact"
                sx={{
                  borderColor: 'rgba(255,255,255,0.4)',
                  color: 'common.white',
                  '&:hover': { borderColor: 'common.white', backgroundColor: 'rgba(255,255,255,0.08)' },
                }}
              >
                Request group rate
              </Button>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, lg: 7 }} sx={{ p: { xs: 3.5, md: 5 }, backgroundColor: 'background.paper' }}>
            <Typography variant="h4" component="h3" sx={{ mb: 3 }}>
              Registration categories
            </Typography>
            <Grid container spacing={3}>
              {REGISTRATION_TYPE_OPTIONS.filter((option) =>
                ['delegate', 'student', 'e-poster'].includes(option.value),
              ).map((option) => (
                <Grid key={option.value} size={{ xs: 12, sm: 4 }}>
                  <Typography variant="h6" component="h4" sx={{ mb: 1.5, color: 'secondary.dark' }}>
                    {option.label}
                  </Typography>
                  <Stack spacing={1}>
                    {(TIER_INCLUSIONS[option.value] ?? []).map((inclusion) => (
                      <Stack key={inclusion} direction="row" spacing={1} alignItems="flex-start">
                        <CheckCircleOutlineIcon sx={{ fontSize: 15, color: 'success.main', mt: 0.35 }} />
                        <Typography variant="body2" color="text.secondary">
                          {inclusion}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Grid>
              ))}
            </Grid>
            <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 3.5 }}>
              Fees are confirmed at the point of registration and exclude local taxes. Speaker, poster and
              sponsor categories are also available — contact the secretariat for details.
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Section>
  );
}
