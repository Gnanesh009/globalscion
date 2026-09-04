import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import RecordVoiceOverOutlinedIcon from '@mui/icons-material/RecordVoiceOverOutlined';
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import { Section } from '@/components/common/Section';
import { SectionHeading } from '@/components/common/SectionHeading';

const FEATURES = [
  {
    icon: <PublicOutlinedIcon />,
    title: 'Global reach',
    description:
      'Programmes delivered across Europe, the Middle East, Asia-Pacific and North America, with online editions designed for remote participation rather than retro-fitted to it.',
  },
  {
    icon: <RecordVoiceOverOutlinedIcon />,
    title: 'Expert speakers',
    description:
      'Speakers are selected by an independent scientific committee on the strength of their work. Sponsors support the event; they do not buy podium time.',
  },
  {
    icon: <ScienceOutlinedIcon />,
    title: 'Research & innovation',
    description:
      'Open calls for abstracts, double-blind review and equal platform for replication and negative findings alongside headline results.',
  },
  {
    icon: <HandshakeOutlinedIcon />,
    title: 'Networking that works',
    description:
      'Chaired discussion tables, mentorship pairings and structured introductions — not an unstructured queue at the coffee stand.',
  },
];

export function WhyGlobalScion() {
  return (
    <Section tone="surface">
      <SectionHeading
        eyebrow="Why GlobalScion"
        title="Built for the science, not the seat count"
        description="Four commitments that shape how every GlobalScion programme is designed and delivered."
        maxWidth={680}
      />

      <Grid container spacing={{ xs: 3, md: 4 }}>
        {FEATURES.map((feature) => (
          <Grid key={feature.title} size={{ xs: 12, sm: 6, lg: 3 }}>
            <Box
              sx={{
                height: '100%',
                pt: 3.5,
                borderTop: '2px solid',
                borderColor: 'divider',
                transition: 'border-color 260ms',
                '&:hover': { borderColor: 'secondary.main' },
              }}
            >
              <Box
                aria-hidden
                sx={{
                  width: 46,
                  height: 46,
                  mb: 2.5,
                  borderRadius: 1,
                  display: 'grid',
                  placeItems: 'center',
                  backgroundColor: 'rgba(14,124,134,0.10)',
                  color: 'secondary.dark',
                  '& svg': { fontSize: 23 },
                }}
              >
                {feature.icon}
              </Box>
              <Typography variant="h4" component="h3" sx={{ mb: 1.25 }}>
                {feature.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {feature.description}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Section>
  );
}
