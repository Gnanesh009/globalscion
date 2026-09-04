import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { Section } from '@/components/common/Section';
import { SectionHeading } from '@/components/common/SectionHeading';
import type { ConferenceSectionProps } from './types';

export function KeyThemes({ conference }: ConferenceSectionProps) {
  if (!conference.key_themes.length) return null;

  return (
    <Section tone="surface" id="scientific-sessions">
      <SectionHeading
        eyebrow="Scientific programme"
        title="Sessions and tracks"
        description="The programme is organised into peer-reviewed tracks. Abstracts may be submitted to any track."
      />

      <Grid container spacing={0} sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
        {conference.key_themes.map((theme, index) => (
          <Grid
            key={theme.id}
            size={{ xs: 12, md: 6 }}
            sx={{
              p: { xs: 2.5, md: 3.5 },
              borderBottom: '1px solid',
              borderColor: 'divider',
              borderRight: { md: index % 2 === 0 ? '1px solid' : 'none' },
              transition: 'background-color 200ms',
              '&:hover': { backgroundColor: 'grey.50' },
            }}
          >
            <Box sx={{ display: 'flex', gap: 2.5 }}>
              <Typography
                aria-hidden
                sx={{
                  flexShrink: 0,
                  fontSize: '0.875rem',
                  fontWeight: 800,
                  color: 'secondary.main',
                  fontVariantNumeric: 'tabular-nums',
                  pt: 0.4,
                }}
              >
                {String(index + 1).padStart(2, '0')}
              </Typography>
              <Box>
                <Typography variant="h5" component="h3" sx={{ mb: 0.75 }}>
                  {theme.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {theme.description}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Section>
  );
}
