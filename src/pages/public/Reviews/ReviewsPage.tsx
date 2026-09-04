import { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Rating from '@mui/material/Rating';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { HERO_IMAGES, img } from '@/api/mock/images';
import { PageHero } from '@/components/common/PageHero';
import { ReviewCard } from '@/components/common/ReviewCard';
import { Section } from '@/components/common/Section';
import { Seo } from '@/components/common/Seo';
import { EmptyState, ErrorState } from '@/components/common/States';
import { PUBLIC_PATHS } from '@/constants';
import { useReviews } from '@/hooks/useResources';
import { HomeFinalCta } from '../Home/sections/HomeFinalCta';

const PAGE_SIZE = 9;

export default function ReviewsPage() {
  const [page, setPage] = useState(1);
  const [rating, setRating] = useState<string>('all');

  const { data, isPending, isError, error, refetch } = useReviews({
    status: 'published',
    page,
    page_size: PAGE_SIZE,
    rating: rating === 'all' ? undefined : Number(rating),
  });

  const reviews = data?.results ?? [];
  const pageCount = Math.ceil((data?.count ?? 0) / PAGE_SIZE);
  const average =
    reviews.length > 0
      ? reviews.reduce((total, review) => total + review.rating, 0) / reviews.length
      : 0;

  return (
    <>
      <Seo
        title="Delegate Reviews"
        description="Unedited feedback from researchers, clinicians and academics who have attended GlobalScion international conferences and webinars."
        canonicalPath={PUBLIC_PATHS.reviews}
      />

      <PageHero
        eyebrow="Reviews"
        title="What delegates say"
        description="Feedback collected after each edition and published without editing. Every review is attributed to a named delegate and their institution."
        image={img.wide(HERO_IMAGES.networking, 1800)}
        breadcrumb={[{ label: 'Reviews' }]}
      />

      <Section>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
          spacing={2.5}
          sx={{ mb: 5 }}
        >
          <Stack direction="row" spacing={2.5} alignItems="center">
            <Box>
              <Typography sx={{ fontSize: '2.25rem', fontWeight: 800, lineHeight: 1 }}>
                {average ? average.toFixed(1) : '—'}
              </Typography>
              <Rating value={average} precision={0.1} readOnly size="small" sx={{ color: 'warning.main' }} />
            </Box>
            <Box sx={{ borderLeft: '1px solid', borderColor: 'divider', pl: 2.5 }}>
              <Typography sx={{ fontWeight: 700 }}>{data?.count ?? 0} published reviews</Typography>
              <Typography variant="body2" color="text.secondary">
                Collected from delegates across recent editions
              </Typography>
            </Box>
          </Stack>

          <TextField
            select
            size="small"
            label="Filter by rating"
            value={rating}
            onChange={(event) => {
              setRating(event.target.value);
              setPage(1);
            }}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="all">All ratings</MenuItem>
            {[5, 4, 3].map((value) => (
              <MenuItem key={value} value={String(value)}>
                {value} stars and above
              </MenuItem>
            ))}
          </TextField>
        </Stack>

        {isPending && (
          <Grid container spacing={{ xs: 3, md: 4 }}>
            {Array.from({ length: 6 }).map((_, index) => (
              <Grid key={index} size={{ xs: 12, md: 6, lg: 4 }}>
                <Skeleton variant="rectangular" height={280} />
              </Grid>
            ))}
          </Grid>
        )}

        {isError && <ErrorState error={error} onRetry={() => void refetch()} />}

        {!isPending && !isError && reviews.length === 0 && (
          <EmptyState
            title="No reviews match this filter"
            description="Try selecting a different rating threshold."
          />
        )}

        {!isPending && !isError && reviews.length > 0 && (
          <Grid container spacing={{ xs: 3, md: 4 }}>
            {reviews.map((review) => (
              <Grid key={review.id} size={{ xs: 12, md: 6, lg: 4 }}>
                <ReviewCard review={review} />
              </Grid>
            ))}
          </Grid>
        )}

        {pageCount > 1 && (
          <Stack alignItems="center" sx={{ mt: 7 }}>
            <Pagination
              count={pageCount}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              shape="rounded"
            />
          </Stack>
        )}
      </Section>

      <HomeFinalCta />
    </>
  );
}
