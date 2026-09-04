import { Link as RouterLink } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import DraftsOutlinedIcon from '@mui/icons-material/DraftsOutlined';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import RecordVoiceOverOutlinedIcon from '@mui/icons-material/RecordVoiceOverOutlined';
import UpcomingOutlinedIcon from '@mui/icons-material/UpcomingOutlined';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { StatCard } from '@/components/admin/StatCard';
import { CategoryBarChart, ConferenceBarChart, TrendAreaChart } from '@/components/charts';
import { Seo } from '@/components/common/Seo';
import { StatCardSkeleton, TableSkeleton } from '@/components/common/Skeletons';
import { ErrorState } from '@/components/common/States';
import { useAuth } from '@/app/AuthProvider';
import { ADMIN_PATHS } from '@/constants';
import { useDashboard } from '@/hooks/useResources';
import { fromNow } from '@/utils/format';
import Skeleton from '@mui/material/Skeleton';

const TARGET_TONE: Record<string, 'primary' | 'success' | 'warning' | 'info' | 'neutral'> = {
  conference: 'primary',
  speaker: 'info',
  review: 'warning',
  registration: 'success',
  abstract: 'info',
  page: 'neutral',
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, isPending, isError, error, refetch } = useDashboard();
  const stats = data?.stats;

  const cards = [
    { label: 'Total conferences', value: stats?.total_conferences ?? 0, icon: <EventNoteOutlinedIcon />, delta: stats?.conferences_delta, href: ADMIN_PATHS.conferences, tone: 'primary' as const },
    { label: 'Published', value: stats?.published ?? 0, icon: <PublicOutlinedIcon />, href: `${ADMIN_PATHS.conferences}?status=published`, tone: 'success' as const },
    { label: 'Drafts', value: stats?.drafts ?? 0, icon: <DraftsOutlinedIcon />, href: `${ADMIN_PATHS.conferences}?status=draft`, tone: 'warning' as const },
    { label: 'Upcoming', value: stats?.upcoming ?? 0, icon: <UpcomingOutlinedIcon />, tone: 'info' as const },
    { label: 'Registrations', value: stats?.registrations ?? 0, icon: <HowToRegOutlinedIcon />, delta: stats?.registrations_delta, href: ADMIN_PATHS.registrations, tone: 'success' as const },
    { label: 'Abstract submissions', value: stats?.abstracts ?? 0, icon: <DescriptionOutlinedIcon />, delta: stats?.abstracts_delta, href: ADMIN_PATHS.abstracts, tone: 'primary' as const },
    { label: 'Speakers', value: stats?.speakers ?? 0, icon: <RecordVoiceOverOutlinedIcon />, delta: stats?.speakers_delta, href: ADMIN_PATHS.speakers, tone: 'info' as const },
    { label: 'Archived', value: stats?.archived ?? 0, icon: <ArchiveOutlinedIcon />, href: `${ADMIN_PATHS.conferences}?status=archived`, tone: 'neutral' as const },
  ];

  if (isError) {
    return (
      <>
        <AdminPageHeader title="Dashboard" />
        <ErrorState error={error} onRetry={() => void refetch()} />
      </>
    );
  }

  return (
    <>
      <Seo title="Dashboard" noIndex />

      <AdminPageHeader
        title={`Good to see you, ${user?.first_name ?? 'there'}`}
        description="An overview of the conference programme, delegate activity and content status."
        actions={
          <>
            <Button component={RouterLink} to={ADMIN_PATHS.conferences} variant="outlined">
              All conferences
            </Button>
            <Button
              component={RouterLink}
              to={ADMIN_PATHS.conferenceNew}
              variant="contained"
              startIcon={<AddIcon />}
            >
              New conference
            </Button>
          </>
        }
      />

      <Grid container spacing={2}>
        {cards.map((card, index) => (
          <Grid key={card.label} size={{ xs: 6, md: 3 }}>
            {isPending ? <StatCardSkeleton key={index} /> : <StatCard {...card} />}
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2} sx={{ mt: 0.5 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card>
            <CardHeader
              title="Registrations & abstract submissions"
              subheader="Rolling twelve months"
            />
            <CardContent>
              {isPending ? (
                <Skeleton variant="rectangular" height={300} />
              ) : (
                <TrendAreaChart data={data!.trends} />
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardHeader title="Conferences by category" subheader="All statuses" />
            <CardContent>
              {isPending ? (
                <Skeleton variant="rectangular" height={300} />
              ) : (
                <CategoryBarChart data={data!.category_distribution} />
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Card sx={{ height: '100%' }}>
            <CardHeader title="Conference schedule" subheader="Events starting each month" />
            <CardContent>
              {isPending ? (
                <Skeleton variant="rectangular" height={260} />
              ) : (
                <ConferenceBarChart data={data!.trends} />
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              title="Recent activity"
              subheader="Latest changes across the CMS"
              action={
                <Button size="small" component={RouterLink} to={ADMIN_PATHS.conferences}>
                  View all
                </Button>
              }
            />
            {isPending ? (
              <TableSkeleton rows={6} columns={3} />
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Who</TableCell>
                      <TableCell>What</TableCell>
                      <TableCell align="right">When</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data!.activity.map((entry) => (
                      <TableRow key={entry.id} hover>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                          <Stack direction="row" spacing={1.25} alignItems="center">
                            <Avatar sx={{ width: 26, height: 26, fontSize: '0.6875rem' }}>
                              {entry.actor
                                .split(' ')
                                .map((part) => part[0])
                                .slice(0, 2)
                                .join('')}
                            </Avatar>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {entry.actor}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                            <Chip
                              size="small"
                              label={entry.target_type}
                              color={
                                TARGET_TONE[entry.target_type] === 'neutral'
                                  ? 'default'
                                  : (TARGET_TONE[entry.target_type] as 'primary')
                              }
                              variant="outlined"
                              sx={{ fontSize: '0.6875rem', textTransform: 'capitalize' }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              {entry.action}{' '}
                              <Box component="span" sx={{ color: 'text.primary', fontWeight: 600 }}>
                                {entry.target}
                              </Box>
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="right" sx={{ whiteSpace: 'nowrap', color: 'text.secondary' }}>
                          {fromNow(entry.created_at)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
