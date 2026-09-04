import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EastIcon from '@mui/icons-material/East';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import { useConferenceMenu, useFeaturedConference } from '@/hooks/useConferences';
import { PUBLIC_PATHS } from '@/constants';
import { formatDateRange, formatLocation } from '@/utils/format';

interface MegaMenuProps {
  onNavigate: () => void;
}

/**
 * Data-driven mega menu: categories and conferences both come from the API,
 * so a conference added in the admin portal appears here without a code change.
 */
export function MegaMenu({ onNavigate }: MegaMenuProps) {
  const { data: groups, isPending } = useConferenceMenu();
  const { data: featured } = useFeaturedConference();

  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        borderTop: '1px solid',
        borderBottom: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 24px 48px rgba(11,31,58,0.10)',
      }}
    >
      <Container sx={{ py: { xs: 3, lg: 5 } }}>
        <Grid container spacing={{ xs: 3, lg: 6 }}>
          {/* Featured conference — the editorial anchor of the menu */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Typography variant="eyebrow" component="p" sx={{ color: 'secondary.main', mb: 2 }}>
              Featured conference
            </Typography>

            {featured ? (
              <Box
                component={RouterLink}
                to={PUBLIC_PATHS.conferenceDetails(featured.slug)}
                onClick={onNavigate}
                sx={{
                  display: 'block',
                  color: 'inherit',
                  textDecoration: 'none',
                  borderRadius: 1,
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'border-color 200ms, box-shadow 200ms',
                  '&:hover': { borderColor: 'secondary.main', boxShadow: '0 12px 28px rgba(11,31,58,0.10)' },
                  '&:hover .mega-featured-image': { transform: 'scale(1.04)' },
                }}
              >
                <Box sx={{ position: 'relative', overflow: 'hidden', aspectRatio: '16 / 9' }}>
                  <Box
                    className="mega-featured-image"
                    component="img"
                    src={featured.card_image ?? featured.hero_image ?? ''}
                    alt=""
                    loading="lazy"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      transition: 'transform 500ms cubic-bezier(0.16,1,0.3,1)',
                    }}
                  />
                </Box>
                <Box sx={{ p: 2.5 }}>
                  <Chip
                    size="small"
                    label={featured.category.name}
                    sx={{ mb: 1.5, backgroundColor: 'grey.100', color: 'primary.main' }}
                  />
                  <Typography variant="h5" sx={{ lineHeight: 1.35 }}>
                    {featured.title}
                  </Typography>
                  <Stack spacing={0.75} sx={{ mt: 1.5 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <EventAvailableIcon sx={{ fontSize: 16, color: 'secondary.main' }} />
                      <Typography variant="caption" color="text.secondary">
                        {formatDateRange(featured.start_date, featured.end_date)}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <PlaceOutlinedIcon sx={{ fontSize: 16, color: 'secondary.main' }} />
                      <Typography variant="caption" color="text.secondary">
                        {formatLocation(featured.city, featured.country)}
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>
              </Box>
            ) : (
              <Skeleton variant="rectangular" height={280} />
            )}
          </Grid>

          <Grid size={{ xs: 12, lg: 8 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Typography variant="eyebrow" component="p" sx={{ color: 'secondary.main' }}>
                Browse by category
              </Typography>
              <Button
                component={RouterLink}
                to={PUBLIC_PATHS.conferences}
                onClick={onNavigate}
                size="small"
                endIcon={<ArrowForwardIcon />}
              >
                All conferences
              </Button>
            </Stack>
            <Divider sx={{ mb: 3 }} />

            {isPending ? (
              <Grid container spacing={3}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Skeleton width="60%" height={22} />
                    <Skeleton height={18} sx={{ mt: 1 }} />
                    <Skeleton height={18} width="80%" />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Grid container spacing={{ xs: 2.5, md: 3.5 }}>
                {groups?.map(({ category, conferences }) => (
                  <Grid key={category.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Stack
                      component={RouterLink}
                      to={`${PUBLIC_PATHS.conferences}?category=${category.slug}`}
                      onClick={onNavigate}
                      direction="row"
                      alignItems="center"
                      spacing={0.75}
                      sx={{
                        color: 'text.primary',
                        textDecoration: 'none',
                        mb: 1.25,
                        '&:hover .mega-cat-arrow': { opacity: 1, transform: 'translateX(2px)' },
                      }}
                    >
                      <Typography variant="h6" component="h3">
                        {category.name}
                      </Typography>
                      <EastIcon
                        className="mega-cat-arrow"
                        sx={{
                          fontSize: 14,
                          color: 'secondary.main',
                          opacity: 0,
                          transition: 'all 180ms',
                        }}
                      />
                    </Stack>

                    <Stack component="ul" spacing={0.25} sx={{ listStyle: 'none', p: 0, m: 0 }}>
                      {conferences.map((conference) => (
                        <Box component="li" key={conference.id}>
                          <Box
                            component={RouterLink}
                            to={PUBLIC_PATHS.conferenceDetails(conference.slug)}
                            onClick={onNavigate}
                            sx={{
                              display: 'block',
                              py: 0.6,
                              fontSize: '0.875rem',
                              lineHeight: 1.45,
                              color: 'text.secondary',
                              textDecoration: 'none',
                              transition: 'color 160ms',
                              '&:hover': { color: 'secondary.dark' },
                              '&:focus-visible': { outline: '2px solid', outlineColor: 'secondary.main', outlineOffset: 2 },
                            }}
                          >
                            {conference.title}
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
