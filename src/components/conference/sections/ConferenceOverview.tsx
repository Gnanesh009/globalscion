import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import { RichTextContent } from '@/components/common/RichTextContent';
import { Section } from '@/components/common/Section';
import { formatDateRange } from '@/utils/format';
import type { ConferenceSectionProps } from './types';

export function ConferenceOverview({ conference }: ConferenceSectionProps) {
  return (
    <Section id="overview">
      <Grid container spacing={{ xs: 5, lg: 8 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Typography variant="eyebrow" component="p" sx={{ color: 'secondary.main', mb: 2 }}>
            Welcome message
          </Typography>
          <Typography variant="h2" component="h2" sx={{ mb: 3 }}>
            {conference.theme_line || 'About this conference'}
          </Typography>
          <RichTextContent html={conference.description} />
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Box
            sx={{
              position: { lg: 'sticky' },
              top: { lg: 110 },
              p: { xs: 3, md: 4 },
              borderRadius: 1,
              backgroundColor: 'primary.dark',
              color: 'common.white',
            }}
          >
            <FormatQuoteIcon sx={{ fontSize: 34, color: 'secondary.light', mb: 1 }} />
            <Typography sx={{ fontSize: '1.125rem', lineHeight: 1.6, fontWeight: 600 }}>
              {conference.short_description}
            </Typography>

            <Stack spacing={2} sx={{ mt: 4, pt: 3, borderTop: '1px solid rgba(255,255,255,0.14)' }}>
              {[
                ['Edition', formatDateRange(conference.start_date, conference.end_date)],
                ['Scientific tracks', `${conference.key_themes.length}`],
                ['Invited speakers', `${conference.speakers.length}`],
                ['Programme days', `${conference.agenda.length || 1}`],
              ].map(([label, value]) => (
                <Stack key={label} direction="row" justifyContent="space-between" alignItems="baseline">
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.55)' }}>
                    {label}
                  </Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem' }}>{value}</Typography>
                </Stack>
              ))}
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Section>
  );
}
