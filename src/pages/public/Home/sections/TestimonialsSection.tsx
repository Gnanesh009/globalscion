import { Link as RouterLink } from 'react-router-dom';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import Skeleton from '@mui/material/Skeleton';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Section } from '@/components/common/Section';
import { SectionHeading } from '@/components/common/SectionHeading';
import { ReviewCard } from '@/components/common/ReviewCard';
import { PUBLIC_PATHS } from '@/constants';
import { useReviews } from '@/hooks/useResources';

export function TestimonialsSection() {
  const { data, isPending } = useReviews({ status: 'published', page_size: 3 });

  return (
    <Section>
      <SectionHeading
        eyebrow="Delegate reviews"
        title="What delegates say"
        description="Unedited feedback from researchers and clinicians who attended recent editions."
        action={
          <Button
            component={RouterLink}
            to={PUBLIC_PATHS.reviews}
            variant="outlined"
            endIcon={<ArrowForwardIcon />}
          >
            Read all reviews
          </Button>
        }
      />

      <Grid container spacing={{ xs: 3, md: 4 }}>
        {isPending
          ? Array.from({ length: 3 }).map((_, index) => (
              <Grid key={index} size={{ xs: 12, md: 4 }}>
                <Skeleton variant="rectangular" height={280} />
              </Grid>
            ))
          : data?.results.map((review) => (
              <Grid key={review.id} size={{ xs: 12, md: 4 }}>
                <ReviewCard review={review} />
              </Grid>
            ))}
      </Grid>
    </Section>
  );
}
