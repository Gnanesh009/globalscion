import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { PUBLIC_PATHS } from '@/constants';
import { formatDateRange, formatLocation } from '@/utils/format';
import type { ConferenceSectionProps } from './types';

export function FinalCTA({ conference }: ConferenceSectionProps) {
  const closed = conference.status === 'completed';

  return (
    <Box component="section" sx={{ backgroundColor: 'primary.dark', color: 'common.white' }}>
      <Container sx={{ py: { xs: 7, md: 10 }, textAlign: 'center' }}>
        <Typography variant="eyebrow" component="p" sx={{ color: 'secondary.light', mb: 2 }}>
          {formatDateRange(conference.start_date, conference.end_date)} ·{' '}
          {formatLocation(conference.city, conference.country)}
        </Typography>
        <Typography variant="h1" component="p" sx={{ color: 'common.white', maxWidth: 860, mx: 'auto' }}>
          {closed ? 'Be part of the next edition' : 'Join the global scientific community'}
        </Typography>
        <Typography
          variant="lead"
          component="p"
          sx={{ mt: 2.5, color: 'rgba(255,255,255,0.72)', maxWidth: 620, mx: 'auto' }}
        >
          {closed
            ? 'Register your interest and we will notify you when the call for abstracts opens.'
            : 'Present your research, meet collaborators and take home evidence you can apply on Monday morning.'}
        </Typography>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          justifyContent="center"
          sx={{ mt: 4.5 }}
        >
          <Button href="#registration" variant="contained" color="secondary" size="large" disabled={closed}>
            {closed ? 'Registration closed' : 'Register now'}
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
            Contact the secretariat
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
