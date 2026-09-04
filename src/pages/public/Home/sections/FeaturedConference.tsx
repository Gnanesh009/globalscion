import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import RecordVoiceOverOutlinedIcon from '@mui/icons-material/RecordVoiceOverOutlined';
import { PUBLIC_PATHS } from '@/constants';
import { useFeaturedConference } from '@/hooks/useConferences';
import { formatDateRange, formatLocation } from '@/utils/format';

export function FeaturedConference() {
  const { data: conference, isPending } = useFeaturedConference();

  if (isPending) {
    return (
      <Box sx={{ backgroundColor: 'primary.dark', py: { xs: 7, md: 12 } }}>
        <Container>
          <Skeleton variant="rectangular" height={380} sx={{ bgcolor: 'rgba(255,255,255,0.08)' }} />
        </Container>
      </Box>
    );
  }

  if (!conference) return null;

  return (
    <Box component="section" sx={{ backgroundColor: 'primary.dark', color: 'common.white' }}>
      <Container sx={{ py: { xs: 7, md: 12 } }}>
        <Grid container spacing={{ xs: 4, lg: 8 }} alignItems="center">
          <Grid size={{ xs: 12, lg: 6 }}>
            <Box
              sx={{
                position: 'relative',
                borderRadius: 1,
                overflow: 'hidden',
                aspectRatio: '4 / 3',
                boxShadow: '0 40px 80px rgba(0,0,0,0.35)',
              }}
            >
              <Box
                component="img"
                src={conference.hero_image ?? conference.card_image ?? ''}
                alt=""
                loading="lazy"
                sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </Box>
          </Grid>

          <Grid size={{ xs: 12, lg: 6 }}>
            <Stack direction="row" spacing={1} sx={{ mb: 2.5 }}>
              <Chip
                size="small"
                label="Featured conference"
                sx={{ backgroundColor: 'secondary.main', color: 'common.white', fontWeight: 700 }}
              />
              <Chip
                size="small"
                variant="outlined"
                label={conference.category.name}
                sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.85)' }}
              />
            </Stack>

            <Typography variant="h1" component="h2" sx={{ color: 'common.white' }}>
              {conference.title}
            </Typography>

            <Typography variant="lead" component="p" sx={{ mt: 2.5, color: 'rgba(255,255,255,0.74)' }}>
              {conference.short_description}
            </Typography>

            <Stack spacing={1.75} sx={{ mt: 4 }}>
              {[
                { icon: <CalendarMonthOutlinedIcon />, text: formatDateRange(conference.start_date, conference.end_date) },
                { icon: <PlaceOutlinedIcon />, text: `${formatLocation(conference.city, conference.country)} · ${conference.venue}` },
                { icon: <RecordVoiceOverOutlinedIcon />, text: `${conference.speakers.length} invited speakers across ${conference.key_themes.length} scientific tracks` },
              ].map((item, index) => (
                <Stack key={index} direction="row" spacing={1.75} alignItems="flex-start">
                  <Box sx={{ color: 'secondary.light', display: 'flex', '& svg': { fontSize: 19 }, mt: 0.2 }}>
                    {item.icon}
                  </Box>
                  <Typography sx={{ color: 'rgba(255,255,255,0.84)', fontWeight: 500 }}>
                    {item.text}
                  </Typography>
                </Stack>
              ))}
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 4.5 }}>
              <Button
                component={RouterLink}
                to={PUBLIC_PATHS.conferenceDetails(conference.slug)}
                variant="contained"
                color="secondary"
                size="large"
                endIcon={<ArrowForwardIcon />}
              >
                View conference
              </Button>
              <Button
                component={RouterLink}
                to={`${PUBLIC_PATHS.conferenceDetails(conference.slug)}#abstract-submission`}
                variant="outlined"
                size="large"
                sx={{
                  borderColor: 'rgba(255,255,255,0.4)',
                  color: 'common.white',
                  '&:hover': { borderColor: 'common.white', backgroundColor: 'rgba(255,255,255,0.08)' },
                }}
              >
                Submit an abstract
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
