import { useState } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { Section } from '@/components/common/Section';
import { SectionHeading } from '@/components/common/SectionHeading';
import type { AgendaSession } from '@/types';
import { formatDate } from '@/utils/format';
import type { ConferenceSectionProps } from './types';

const SESSION_TONE: Record<AgendaSession['session_type'], { label: string; bg: string; fg: string }> = {
  keynote: { label: 'Keynote', bg: 'rgba(11,31,58,0.08)', fg: '#0B1F3A' },
  talk: { label: 'Talk', bg: 'rgba(37,99,235,0.10)', fg: '#1D4ED8' },
  panel: { label: 'Panel', bg: 'rgba(14,124,134,0.12)', fg: '#0A5D66' },
  workshop: { label: 'Workshop', bg: 'rgba(217,119,6,0.14)', fg: '#B45309' },
  poster: { label: 'Posters', bg: 'rgba(124,58,237,0.10)', fg: '#6D28D9' },
  break: { label: 'Break', bg: 'rgba(90,100,116,0.10)', fg: '#5A6474' },
};

export function AgendaSection({ conference }: ConferenceSectionProps) {
  const [day, setDay] = useState(0);
  if (!conference.agenda.length) return null;

  const activeDay = conference.agenda[Math.min(day, conference.agenda.length - 1)];
  const speakerName = (id: string) => conference.speakers.find((s) => s.id === id)?.name;

  return (
    <Section tone="surface" id="agenda">
      <SectionHeading
        eyebrow="Programme"
        title="Sample agenda"
        description="A representative schedule. The final programme is published four weeks before the opening session."
      />

      <Tabs
        value={Math.min(day, conference.agenda.length - 1)}
        onChange={(_, value: number) => setDay(value)}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="Conference days"
        sx={{ borderBottom: '1px solid', borderColor: 'divider', mb: 4 }}
      >
        {conference.agenda.map((agendaDay) => (
          <Tab
            key={agendaDay.id}
            label={
              <Box sx={{ textAlign: 'left' }}>
                <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem' }}>
                  Day {agendaDay.day_number}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDate(agendaDay.date, 'ddd, DD MMM')}
                </Typography>
              </Box>
            }
          />
        ))}
      </Tabs>

      <Stack>
        {activeDay.sessions.map((session) => {
          const tone = SESSION_TONE[session.session_type];
          const speakers = session.speaker_ids.map(speakerName).filter(Boolean);

          return (
            <Stack
              key={session.id}
              direction={{ xs: 'column', md: 'row' }}
              spacing={{ xs: 1, md: 4 }}
              sx={{
                py: 3,
                borderTop: '1px solid',
                borderColor: 'divider',
                opacity: session.session_type === 'break' ? 0.72 : 1,
              }}
            >
              <Box sx={{ width: { md: 150 }, flexShrink: 0 }}>
                <Typography
                  sx={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums', fontSize: '0.9375rem' }}
                >
                  {session.time_start} – {session.time_end}
                </Typography>
                <Chip
                  size="small"
                  label={tone.label}
                  sx={{ mt: 1, backgroundColor: tone.bg, color: tone.fg, fontSize: '0.6875rem' }}
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" component="h3" sx={{ mb: 0.75 }}>
                  {session.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {session.description}
                </Typography>
                {speakers.length > 0 && (
                  <Typography
                    variant="caption"
                    sx={{ display: 'block', mt: 1.25, color: 'secondary.dark', fontWeight: 700 }}
                  >
                    {speakers.join(' · ')}
                  </Typography>
                )}
              </Box>
            </Stack>
          );
        })}
      </Stack>
    </Section>
  );
}
