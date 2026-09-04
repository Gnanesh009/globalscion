import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';
import { Section } from '@/components/common/Section';
import { SectionHeading } from '@/components/common/SectionHeading';
import type { ConferenceSectionProps } from './types';

export function WhoShouldAttend({ conference }: ConferenceSectionProps) {
  if (!conference.who_should_attend.length) return null;

  return (
    <Section id="who-should-attend">
      <Grid container spacing={{ xs: 4, lg: 8 }}>
        <Grid size={{ xs: 12, lg: 5 }}>
          <SectionHeading
            eyebrow="Audience"
            title="Who should attend"
            description="The programme is built for practitioners and researchers who need to act on the evidence, not only read about it."
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Grid container spacing={2}>
            {conference.who_should_attend.map((item) => (
              <Grid key={item} size={{ xs: 12, sm: 6 }}>
                <Stack direction="row" spacing={1.75} alignItems="flex-start">
                  <Box
                    aria-hidden
                    sx={{
                      mt: 0.35,
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
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {item}
                  </Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Section>
  );
}
