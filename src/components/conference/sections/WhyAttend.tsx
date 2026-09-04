import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { Section } from '@/components/common/Section';
import { SectionHeading } from '@/components/common/SectionHeading';
import type { ConferenceSectionProps } from './types';

export function WhyAttend({ conference }: ConferenceSectionProps) {
  if (!conference.why_attend.length) return null;

  return (
    <Section tone="tint" id="why-attend">
      <SectionHeading
        eyebrow="Benefits"
        title="Why attend this edition"
        align="center"
        maxWidth={640}
      />

      <Grid container spacing={{ xs: 2.5, md: 3 }}>
        {conference.why_attend.map((benefit, index) => (
          <Grid key={benefit} size={{ xs: 12, sm: 6, lg: 4 }}>
            <Box
              sx={{
                height: '100%',
                p: 3.5,
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                transition: 'border-color 220ms, transform 220ms',
                '&:hover': { borderColor: 'secondary.main', transform: 'translateY(-2px)' },
              }}
            >
              <Typography
                aria-hidden
                sx={{
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  color: 'rgba(11,31,58,0.12)',
                  lineHeight: 1,
                  mb: 2,
                }}
              >
                {String(index + 1).padStart(2, '0')}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {benefit}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Section>
  );
}
