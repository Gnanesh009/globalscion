import { Link as RouterLink } from 'react-router-dom';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Section } from '@/components/common/Section';
import { SectionHeading } from '@/components/common/SectionHeading';
import { ConferenceGridSkeleton } from '@/components/common/Skeletons';
import { EmptyState, ErrorState } from '@/components/common/States';
import { ConferenceCard } from '@/components/conference/ConferenceCard';
import { PUBLIC_PATHS } from '@/constants';
import { useConferences } from '@/hooks/useConferences';

export function UpcomingConferences() {
  const { data, isPending, isError, error, refetch } = useConferences({
    status: 'upcoming',
    page_size: 6,
  });

  return (
    <Section id="upcoming">
      <SectionHeading
        eyebrow="Upcoming programme"
        title="Conferences open for registration"
        description="Peer-reviewed programmes taking place over the coming months, in person, online and hybrid."
        action={
          <Button
            component={RouterLink}
            to={PUBLIC_PATHS.conferences}
            variant="outlined"
            endIcon={<ArrowForwardIcon />}
          >
            View all conferences
          </Button>
        }
      />

      {isPending && <ConferenceGridSkeleton count={6} />}

      {isError && <ErrorState error={error} onRetry={() => void refetch()} />}

      {!isPending && !isError && data?.results.length === 0 && (
        <EmptyState
          title="No upcoming conferences right now"
          description="New editions are announced regularly — subscribe below to hear first."
        />
      )}

      {!isPending && !isError && (data?.results.length ?? 0) > 0 && (
        <Grid container spacing={{ xs: 3, md: 4 }}>
          {data!.results.map((conference) => (
            <Grid key={conference.id} size={{ xs: 12, md: 6, lg: 4 }}>
              <ConferenceCard conference={conference} />
            </Grid>
          ))}
        </Grid>
      )}
    </Section>
  );
}
