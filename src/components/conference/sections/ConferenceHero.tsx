import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import { EVENT_FORMAT_OPTIONS } from '@/constants';
import { useCountdown } from '@/hooks/useUi';
import { formatDateRange, formatLocation } from '@/utils/format';
import type { ConferenceSectionProps } from './types';

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <Box sx={{ textAlign: 'center', minWidth: 62 }}>
      <Typography
        component="span"
        sx={{
          display: 'block',
          fontSize: { xs: '1.5rem', md: '1.875rem' },
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: 'common.white',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {String(value).padStart(2, '0')}
      </Typography>
      <Typography
        component="span"
        sx={{
          fontSize: '0.625rem',
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.55)',
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}

export function ConferenceHero({ conference }: ConferenceSectionProps) {
  const countdown = useCountdown(conference.start_date);
  const formatLabel =
    EVENT_FORMAT_OPTIONS.find((option) => option.value === conference.event_format)?.label ?? '';

  return (
    <Box
      component="header"
      sx={{
        position: 'relative',
        backgroundColor: 'primary.dark',
        color: 'common.white',
        overflow: 'hidden',
      }}
    >
      {conference.hero_image && (
        <Box
          component="img"
          src={conference.hero_image}
          alt=""
          aria-hidden
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.32,
          }}
        />
      )}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(100deg, rgba(6,15,30,0.95) 0%, rgba(11,31,58,0.86) 48%, rgba(11,31,58,0.55) 100%)',
        }}
      />

      <Container sx={{ position: 'relative', py: { xs: 7, md: 12 } }}>
        <Box sx={{ maxWidth: 880 }}>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
            <Chip
              label={conference.category.name}
              size="small"
              sx={{ backgroundColor: 'secondary.main', color: 'common.white', fontWeight: 700 }}
            />
            <Chip
              label={formatLabel}
              size="small"
              variant="outlined"
              sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.85)' }}
            />
            {conference.status === 'completed' && (
              <Chip
                label="Past edition"
                size="small"
                variant="outlined"
                sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.85)' }}
              />
            )}
          </Stack>

          <Typography variant="hero" component="h1" sx={{ fontSize: 'clamp(2rem, 1.3rem + 2.8vw, 3.5rem)' }}>
            {conference.title}
          </Typography>

          {conference.hero_subtitle && (
            <Typography
              variant="lead"
              component="p"
              sx={{ mt: 2.5, color: 'rgba(255,255,255,0.78)', maxWidth: 720 }}
            >
              {conference.hero_subtitle}
            </Typography>
          )}

          <Stack
            direction="row"
            spacing={{ xs: 2.5, md: 4 }}
            flexWrap="wrap"
            useFlexGap
            sx={{ mt: 4 }}
            divider={
              <Divider
                orientation="vertical"
                flexItem
                sx={{ borderColor: 'rgba(255,255,255,0.16)', display: { xs: 'none', md: 'block' } }}
              />
            }
          >
            <Stack direction="row" spacing={1.25} alignItems="center">
              <EventAvailableIcon sx={{ fontSize: 19, color: 'secondary.light' }} />
              <Typography sx={{ fontWeight: 600 }}>
                {formatDateRange(conference.start_date, conference.end_date)}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1.25} alignItems="center">
              <PlaceOutlinedIcon sx={{ fontSize: 19, color: 'secondary.light' }} />
              <Typography sx={{ fontWeight: 600 }}>
                {formatLocation(conference.city, conference.country)}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1.25} alignItems="center">
              <PublicOutlinedIcon sx={{ fontSize: 19, color: 'secondary.light' }} />
              <Typography sx={{ fontWeight: 600 }}>{conference.timezone}</Typography>
            </Stack>
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 5 }}>
            <Button
              href="#registration"
              variant="contained"
              color="secondary"
              size="large"
              disabled={conference.status === 'completed'}
            >
              {conference.status === 'completed' ? 'Registration closed' : conference.hero_cta_label}
            </Button>
            <Button
              href="#abstract-submission"
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
            {conference.brochure_url && (
              <Button
                href={conference.brochure_url}
                variant="text"
                size="large"
                startIcon={<DownloadOutlinedIcon />}
                sx={{ color: 'rgba(255,255,255,0.8)', '&:hover': { color: 'common.white' } }}
              >
                Download brochure
              </Button>
            )}
          </Stack>

          {countdown && (
            <Box
              sx={{
                mt: 6,
                display: 'inline-flex',
                alignItems: 'center',
                gap: { xs: 2, md: 3.5 },
                px: { xs: 2.5, md: 3.5 },
                py: 2,
                borderRadius: 1,
                border: '1px solid rgba(255,255,255,0.14)',
                backgroundColor: 'rgba(255,255,255,0.05)',
              }}
              role="timer"
              aria-label={`${countdown.days} days until the conference begins`}
            >
              <Typography
                variant="eyebrow"
                sx={{ color: 'rgba(255,255,255,0.5)', display: { xs: 'none', md: 'block' } }}
              >
                Starts in
              </Typography>
              <Stack direction="row" spacing={{ xs: 1.5, md: 2.5 }}>
                <CountdownUnit value={countdown.days} label="Days" />
                <CountdownUnit value={countdown.hours} label="Hours" />
                <CountdownUnit value={countdown.minutes} label="Mins" />
                <CountdownUnit value={countdown.seconds} label="Secs" />
              </Stack>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}
