import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import HubOutlinedIcon from '@mui/icons-material/HubOutlined';
import EditCalendarOutlinedIcon from '@mui/icons-material/EditCalendarOutlined';
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import RecordVoiceOverOutlinedIcon from '@mui/icons-material/RecordVoiceOverOutlined';
import { Section } from '@/components/common/Section';
import { EVENT_FORMAT_OPTIONS } from '@/constants';
import { daysUntil, formatDate, formatDateRange, formatLocation } from '@/utils/format';
import type { ConferenceSectionProps } from './types';

interface InfoItem {
  icon: ReactNode;
  label: string;
  value: string;
  hint?: string;
}

export function EventInformation({ conference }: ConferenceSectionProps) {
  const formatLabel =
    EVENT_FORMAT_OPTIONS.find((option) => option.value === conference.event_format)?.label ?? '—';
  const abstractDays = daysUntil(conference.abstract_deadline);

  const items: InfoItem[] = [
    {
      icon: <CalendarMonthOutlinedIcon />,
      label: 'Conference dates',
      value: formatDateRange(conference.start_date, conference.end_date),
      hint: conference.timezone,
    },
    {
      icon: <PlaceOutlinedIcon />,
      label: 'Venue',
      value: formatLocation(conference.city, conference.country),
      hint: conference.venue,
    },
    {
      icon: <HubOutlinedIcon />,
      label: 'Format',
      value: formatLabel,
      hint: conference.event_format === 'online' ? 'Live streamed with moderated Q&A' : 'Recordings available for 30 days',
    },
    {
      icon: <EditCalendarOutlinedIcon />,
      label: 'Abstract deadline',
      value: formatDate(conference.abstract_deadline),
      hint:
        abstractDays === null
          ? 'Submissions closed'
          : abstractDays > 0
            ? `${abstractDays} days remaining`
            : 'Submissions closed',
    },
    {
      icon: <HowToRegOutlinedIcon />,
      label: 'Registration closes',
      value: formatDate(conference.registration_deadline),
      hint: 'Group and student rates available',
    },
    {
      icon: <RecordVoiceOverOutlinedIcon />,
      label: 'Confirmed speakers',
      value: `${conference.speakers.length} speakers`,
      hint: `${conference.key_themes.length} scientific tracks`,
    },
  ];

  return (
    <Section tone="surface" id="event-information" sx={{ py: { xs: 5, md: 7 } }}>
      {/* Hairline grid: a 1px gap over the divider colour renders clean rules at
          every breakpoint without per-cell border arithmetic. */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
          gap: '1px',
          backgroundColor: 'divider',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        {items.map((item) => (
          <Box
            key={item.label}
            sx={{ p: { xs: 2.5, md: 3 }, backgroundColor: 'background.paper' }}
          >
            <Stack direction="row" spacing={2}>
              <Box
                aria-hidden
                sx={{
                  flexShrink: 0,
                  width: 40,
                  height: 40,
                  borderRadius: 1,
                  display: 'grid',
                  placeItems: 'center',
                  backgroundColor: 'grey.100',
                  color: 'secondary.dark',
                  '& svg': { fontSize: 20 },
                }}
              >
                {item.icon}
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="eyebrow" component="p" sx={{ color: 'text.disabled', mb: 0.5 }}>
                  {item.label}
                </Typography>
                <Typography sx={{ fontWeight: 700, lineHeight: 1.35 }}>{item.value}</Typography>
                {item.hint && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.4 }}>
                    {item.hint}
                  </Typography>
                )}
              </Box>
            </Stack>
          </Box>
        ))}
      </Box>
    </Section>
  );
}
