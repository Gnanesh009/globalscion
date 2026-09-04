import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import HubOutlinedIcon from '@mui/icons-material/HubOutlined';
import { PUBLIC_PATHS } from '@/constants';
import type { ConferenceListItem } from '@/types';
import { formatDateRange, formatLocation } from '@/utils/format';
import { conferenceMeta } from '@/utils/statusMeta';
import { StatusChip } from '@/components/common/StatusChip';

const FORMAT_META = {
  online: { label: 'Online', icon: <VideocamOutlinedIcon sx={{ fontSize: 15 }} /> },
  physical: { label: 'In person', icon: <GroupsOutlinedIcon sx={{ fontSize: 15 }} /> },
  hybrid: { label: 'Hybrid', icon: <HubOutlinedIcon sx={{ fontSize: 15 }} /> },
} as const;

interface ConferenceCardProps {
  conference: ConferenceListItem;
  /** Horizontal layout for dense list views. */
  variant?: 'grid' | 'row';
}

export function ConferenceCard({ conference, variant = 'grid' }: ConferenceCardProps) {
  const format = FORMAT_META[conference.event_format];
  const isRow = variant === 'row';

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: isRow ? { xs: 'column', md: 'row' } : 'column',
        overflow: 'hidden',
        position: 'relative',
        '&:hover': {
          borderColor: 'transparent',
          boxShadow: '0 18px 44px rgba(11,31,58,0.12)',
          transform: 'translateY(-3px)',
        },
        '&:focus-within': { borderColor: 'secondary.main' },
        '&:hover .conf-card-image': { transform: 'scale(1.05)' },
        '&:hover .conf-card-arrow': { transform: 'translateX(4px)' },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0,
          width: isRow ? { xs: '100%', md: 300 } : '100%',
          aspectRatio: isRow ? { xs: '16 / 9', md: 'auto' } : '16 / 10',
          backgroundColor: 'grey.100',
        }}
      >
        <Box
          className="conf-card-image"
          component="img"
          src={conference.card_image ?? conference.hero_image ?? ''}
          alt=""
          loading="lazy"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transition: 'transform 600ms cubic-bezier(0.16,1,0.3,1)',
          }}
        />
        <Stack direction="row" spacing={1} sx={{ position: 'absolute', top: 12, left: 12 }}>
          <StatusChip
            meta={conferenceMeta(conference.status)}
            sx={{ backdropFilter: 'blur(6px)', backgroundColor: 'rgba(255,255,255,0.92)' }}
          />
          {conference.is_featured && (
            <Chip
              size="small"
              label="Featured"
              sx={{ backgroundColor: 'secondary.main', color: 'common.white', fontWeight: 700 }}
            />
          )}
        </Stack>
      </Box>

      <Stack sx={{ p: { xs: 2.5, md: 3 }, flex: 1, minWidth: 0 }}>
        <Typography
          variant="eyebrow"
          component="p"
          sx={{ color: 'secondary.main', mb: 1.25, fontSize: '0.6875rem' }}
        >
          {conference.category.name}
        </Typography>

        <Typography variant="h4" component="h3" sx={{ lineHeight: 1.32 }}>
          <Box
            component={RouterLink}
            to={PUBLIC_PATHS.conferenceDetails(conference.slug)}
            sx={{
              color: 'inherit',
              textDecoration: 'none',
              // Stretched link keeps the whole card clickable while remaining
              // a single, screen-reader-friendly target.
              '&::after': { content: '""', position: 'absolute', inset: 0 },
              '&:hover': { color: 'secondary.dark' },
              '&:focus-visible': { outline: 'none' },
            }}
          >
            {conference.title}
          </Box>
        </Typography>

        <Stack spacing={1} sx={{ mt: 2 }}>
          <Stack direction="row" spacing={1.25} alignItems="center">
            <EventAvailableIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
            <Typography variant="caption" color="text.secondary">
              {formatDateRange(conference.start_date, conference.end_date)}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1.25} alignItems="center">
            <PlaceOutlinedIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
            <Typography variant="caption" color="text.secondary" noWrap>
              {formatLocation(conference.city, conference.country)}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1.25} alignItems="center">
            <Box sx={{ color: 'text.disabled', display: 'flex' }}>{format.icon}</Box>
            <Typography variant="caption" color="text.secondary">
              {format.label} · {conference.speaker_count} speakers
            </Typography>
          </Stack>
        </Stack>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 2,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {conference.short_description}
        </Typography>

        <Stack
          direction="row"
          alignItems="center"
          spacing={0.75}
          sx={{ mt: 'auto', pt: 2.5, color: 'primary.main', fontWeight: 700, fontSize: '0.875rem' }}
        >
          <span>View conference</span>
          <ArrowForwardIcon
            className="conf-card-arrow"
            sx={{ fontSize: 16, transition: 'transform 220ms cubic-bezier(0.16,1,0.3,1)' }}
          />
        </Stack>
      </Stack>
    </Card>
  );
}
