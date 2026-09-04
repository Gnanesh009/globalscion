import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid2';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import LanguageIcon from '@mui/icons-material/Language';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { Section } from '@/components/common/Section';
import { SectionHeading } from '@/components/common/SectionHeading';
import type { Speaker } from '@/types';
import { initialsOf } from '@/utils/format';
import type { ConferenceSectionProps } from './types';

function SpeakerCard({ speaker, onOpen }: { speaker: Speaker; onOpen: () => void }) {
  return (
    <Box
      component="button"
      onClick={onOpen}
      aria-label={`View biography of ${speaker.name}`}
      sx={{
        width: '100%',
        height: '100%',
        textAlign: 'left',
        cursor: 'pointer',
        background: 'none',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        p: 3,
        transition: 'box-shadow 240ms, transform 240ms, border-color 240ms',
        '&:hover': {
          borderColor: 'transparent',
          boxShadow: '0 16px 40px rgba(11,31,58,0.10)',
          transform: 'translateY(-3px)',
        },
        '&:focus-visible': { outline: '2px solid', outlineColor: 'secondary.main', outlineOffset: 2 },
      }}
    >
      <Stack direction="row" spacing={2.5} alignItems="flex-start">
        <Avatar
          src={speaker.photo ?? undefined}
          alt=""
          sx={{ width: 76, height: 76, fontSize: '1.25rem', backgroundColor: 'primary.main' }}
        >
          {initialsOf(speaker.name)}
        </Avatar>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
            <Typography variant="h5" component="h3" sx={{ lineHeight: 1.3 }}>
              {speaker.name}
            </Typography>
          </Stack>
          <Typography variant="body2" sx={{ color: 'secondary.dark', fontWeight: 600 }}>
            {speaker.designation}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            {speaker.institution}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1.5 }} flexWrap="wrap" useFlexGap>
            <Chip size="small" variant="outlined" label={speaker.country} />
            {speaker.is_keynote && (
              <Chip
                size="small"
                label="Keynote"
                sx={{ backgroundColor: 'rgba(14,124,134,0.12)', color: 'secondary.dark' }}
              />
            )}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}

export function SpeakersSection({ conference }: ConferenceSectionProps) {
  const [active, setActive] = useState<Speaker | null>(null);
  if (!conference.speakers.length) return null;

  return (
    <Section id="speakers">
      <SectionHeading
        eyebrow="Renowned speakers"
        title="Who you will hear from"
        description="Keynote and invited speakers confirmed by the scientific committee. Select a speaker to read their full biography."
      />

      <Grid container spacing={{ xs: 2.5, md: 3 }}>
        {conference.speakers.map((speaker) => (
          <Grid key={speaker.id} size={{ xs: 12, md: 6 }}>
            <SpeakerCard speaker={speaker} onOpen={() => setActive(speaker)} />
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={Boolean(active)}
        onClose={() => setActive(null)}
        maxWidth="sm"
        fullWidth
        aria-labelledby="speaker-dialog-title"
      >
        {active && (
          <DialogContent sx={{ p: { xs: 3, md: 4 } }}>
            <IconButton
              onClick={() => setActive(null)}
              aria-label="Close biography"
              sx={{ position: 'absolute', top: 12, right: 12 }}
            >
              <CloseIcon />
            </IconButton>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ sm: 'center' }}>
              <Avatar
                src={active.photo ?? undefined}
                alt=""
                sx={{ width: 96, height: 96, backgroundColor: 'primary.main' }}
              >
                {initialsOf(active.name)}
              </Avatar>
              <Box>
                <Typography id="speaker-dialog-title" variant="h3" component="h2">
                  {active.name}
                </Typography>
                <Typography sx={{ color: 'secondary.dark', fontWeight: 600, mt: 0.5 }}>
                  {active.designation}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {active.institution} · {active.country}
                </Typography>
              </Box>
            </Stack>

            <Typography variant="body1" color="text.secondary" sx={{ mt: 3 }}>
              {active.biography}
            </Typography>

            {(active.website || active.linkedin) && (
              <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
                {active.website && (
                  <IconButton
                    href={active.website}
                    target="_blank"
                    rel="noopener"
                    aria-label={`${active.name} website`}
                    sx={{ border: '1px solid', borderColor: 'divider' }}
                  >
                    <LanguageIcon fontSize="small" />
                  </IconButton>
                )}
                {active.linkedin && (
                  <IconButton
                    href={active.linkedin}
                    target="_blank"
                    rel="noopener"
                    aria-label={`${active.name} on LinkedIn`}
                    sx={{ border: '1px solid', borderColor: 'divider' }}
                  >
                    <LinkedInIcon fontSize="small" />
                  </IconButton>
                )}
              </Stack>
            )}
          </DialogContent>
        )}
      </Dialog>
    </Section>
  );
}
