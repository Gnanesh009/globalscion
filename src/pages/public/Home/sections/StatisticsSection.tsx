import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { useCountUp, useInView } from '@/hooks/useUi';
import { formatNumber } from '@/utils/format';

const STATS = [
  { value: 500, suffix: '+', label: 'Conferences delivered', caption: 'since 2015' },
  { value: 50, suffix: '+', label: 'Countries represented', caption: 'across five continents' },
  { value: 10000, suffix: '+', label: 'Participants hosted', caption: 'in person and online' },
  { value: 1000, suffix: '+', label: 'Invited speakers', caption: 'peer-selected' },
];

function StatItem({ stat, active }: { stat: (typeof STATS)[number]; active: boolean }) {
  const value = useCountUp(stat.value, active);

  return (
    <Box sx={{ textAlign: { xs: 'left', md: 'center' } }}>
      <Typography
        component="p"
        sx={{
          fontSize: { xs: '2.25rem', md: '3rem' },
          fontWeight: 800,
          letterSpacing: '-0.03em',
          lineHeight: 1,
          color: 'common.white',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {formatNumber(value)}
        <Box component="span" sx={{ color: 'secondary.light' }}>
          {stat.suffix}
        </Box>
      </Typography>
      <Typography sx={{ mt: 1.5, fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>
        {stat.label}
      </Typography>
      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
        {stat.caption}
      </Typography>
    </Box>
  );
}

export function StatisticsSection() {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <Box
      ref={ref}
      component="section"
      aria-label="GlobalScion by the numbers"
      sx={{
        backgroundColor: '#060F1E',
        color: 'common.white',
        backgroundImage:
          'radial-gradient(circle at 15% 20%, rgba(20,162,174,0.16) 0%, transparent 42%), radial-gradient(circle at 85% 80%, rgba(37,99,235,0.14) 0%, transparent 45%)',
      }}
    >
      <Container sx={{ py: { xs: 7, md: 10 } }}>
        <Grid container spacing={{ xs: 4, md: 3 }}>
          {STATS.map((stat) => (
            <Grid key={stat.label} size={{ xs: 6, md: 3 }}>
              <StatItem stat={stat} active={inView} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
