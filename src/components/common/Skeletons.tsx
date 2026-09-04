import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

export function ConferenceCardSkeleton() {
  return (
    <Card sx={{ height: '100%', overflow: 'hidden' }}>
      <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 0 }} />
      <Box sx={{ p: 3 }}>
        <Skeleton width={110} height={20} />
        <Skeleton height={30} sx={{ mt: 1.5 }} />
        <Skeleton width="70%" height={30} />
        <Stack spacing={1} sx={{ mt: 2.5 }}>
          <Skeleton width="55%" height={18} />
          <Skeleton width="45%" height={18} />
        </Stack>
        <Skeleton height={16} sx={{ mt: 2.5 }} />
        <Skeleton width="85%" height={16} />
      </Box>
    </Card>
  );
}

export function ConferenceGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <Grid container spacing={{ xs: 3, md: 4 }} aria-hidden>
      {Array.from({ length: count }).map((_, index) => (
        <Grid key={index} size={{ xs: 12, md: 6, lg: 4 }}>
          <ConferenceCardSkeleton />
        </Grid>
      ))}
    </Grid>
  );
}

export function SpeakerCardSkeleton() {
  return (
    <Card sx={{ p: 3 }}>
      <Skeleton variant="circular" width={84} height={84} />
      <Skeleton width="70%" height={26} sx={{ mt: 2 }} />
      <Skeleton width="55%" height={18} sx={{ mt: 0.5 }} />
      <Skeleton width="45%" height={18} />
    </Card>
  );
}

export function DetailPageSkeleton() {
  return (
    <Box aria-busy="true" aria-live="polite">
      <Skeleton variant="rectangular" height={460} />
      <Box sx={{ maxWidth: 1280, mx: 'auto', px: { xs: 2.5, md: 5 }, py: { xs: 6, md: 10 } }}>
        <Skeleton width={180} height={22} />
        <Skeleton width="65%" height={46} sx={{ mt: 2 }} />
        <Stack spacing={1.2} sx={{ mt: 4 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} width={`${95 - i * 6}%`} height={18} />
          ))}
        </Stack>
        <Grid container spacing={3} sx={{ mt: 5 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Grid key={i} size={{ xs: 12, md: 4 }}>
              <Skeleton variant="rectangular" height={170} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export function TableSkeleton({ rows = 8, columns = 6 }: { rows?: number; columns?: number }) {
  return (
    <Stack spacing={1.2} sx={{ p: 2 }} aria-hidden>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <Stack key={rowIndex} direction="row" spacing={2}>
          {Array.from({ length: columns }).map((__, colIndex) => (
            <Skeleton key={colIndex} height={22} sx={{ flex: colIndex === 0 ? 2 : 1 }} />
          ))}
        </Stack>
      ))}
    </Stack>
  );
}

export function StatCardSkeleton() {
  return (
    <Card sx={{ p: 2.5 }}>
      <Skeleton width={100} height={16} />
      <Skeleton width={70} height={40} sx={{ mt: 1 }} />
      <Skeleton width={120} height={14} sx={{ mt: 1 }} />
    </Card>
  );
}
