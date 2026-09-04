import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import BiotechOutlinedIcon from '@mui/icons-material/BiotechOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import HealthAndSafetyOutlinedIcon from '@mui/icons-material/HealthAndSafetyOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import { SUBJECT_IMAGES, img } from '@/api/mock/images';
import { Section } from '@/components/common/Section';
import { SectionHeading } from '@/components/common/SectionHeading';

const AUDIENCES = [
  { icon: <BiotechOutlinedIcon />, title: 'Researchers & scientists', text: 'Present original work and find collaborators across institutions.' },
  { icon: <LocalHospitalOutlinedIcon />, title: 'Doctors & clinicians', text: 'Translate current evidence directly into clinical practice.' },
  { icon: <SchoolOutlinedIcon />, title: 'Academicians', text: 'Shape curricula and build cross-border teaching partnerships.' },
  { icon: <GroupsOutlinedIcon />, title: 'Students & early career', text: 'Reduced rates, mentorship pairings and chaired presentation slots.' },
  { icon: <HealthAndSafetyOutlinedIcon />, title: 'Healthcare professionals', text: 'Allied health, nursing and public health practitioners.' },
  { icon: <BusinessCenterOutlinedIcon />, title: 'Industry professionals', text: 'Meet investigators, regulators and health system decision makers.' },
];

export function WhoShouldAttendSection() {
  return (
    <Section tone="surface">
      <Grid container spacing={{ xs: 5, lg: 8 }} alignItems="center">
        <Grid size={{ xs: 12, lg: 5 }}>
          <SectionHeading
            eyebrow="Audience"
            title="Who should attend"
            description="GlobalScion programmes are built for people who need to act on evidence — in a clinic, a laboratory, a lecture theatre or a boardroom."
          />
          <Box
            component="img"
            src={img.card(SUBJECT_IMAGES.studentAudience, 900)}
            alt="Delegates listening during a conference session"
            loading="lazy"
            sx={{
              display: { xs: 'none', lg: 'block' },
              width: '100%',
              borderRadius: 1,
              aspectRatio: '4 / 3',
              objectFit: 'cover',
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, lg: 7 }}>
          <Grid container spacing={{ xs: 2.5, md: 3 }}>
            {AUDIENCES.map((audience) => (
              <Grid key={audience.title} size={{ xs: 12, sm: 6 }}>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{
                    height: '100%',
                    p: 2.75,
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'border-color 220ms, background-color 220ms',
                    '&:hover': { borderColor: 'secondary.main', backgroundColor: 'grey.50' },
                  }}
                >
                  <Box
                    aria-hidden
                    sx={{
                      flexShrink: 0,
                      color: 'secondary.dark',
                      display: 'flex',
                      '& svg': { fontSize: 24 },
                    }}
                  >
                    {audience.icon}
                  </Box>
                  <Box>
                    <Typography variant="h5" component="h3" sx={{ mb: 0.5 }}>
                      {audience.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {audience.text}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Section>
  );
}
