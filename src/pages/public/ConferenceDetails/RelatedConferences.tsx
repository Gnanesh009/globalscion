import Grid from '@mui/material/Grid2';
import { Section } from '@/components/common/Section';
import { SectionHeading } from '@/components/common/SectionHeading';
import { ConferenceGridSkeleton } from '@/components/common/Skeletons';
import { ConferenceCard } from '@/components/conference/ConferenceCard';
import { useConferences } from '@/hooks/useConferences';

interface RelatedConferencesProps {
  categorySlug: string;
  excludeSlug: string;
}

export function RelatedConferences({ categorySlug, excludeSlug }: RelatedConferencesProps) {
  const { data, isPending } = useConferences({
    category: categorySlug,
    status: 'upcoming',
    page_size: 4,
  });

  const related = (data?.results ?? []).filter((item) => item.slug !== excludeSlug).slice(0, 3);

  if (!isPending && related.length === 0) return null;

  return (
    <Section tone="tint" aria-labelledby="related-conferences-heading">
      <SectionHeading
        id="related-conferences-heading"
        eyebrow="Related"
        title="Other conferences in this field"
      />
      {isPending ? (
        <ConferenceGridSkeleton count={3} />
      ) : (
        <Grid container spacing={{ xs: 3, md: 4 }}>
          {related.map((conference) => (
            <Grid key={conference.id} size={{ xs: 12, md: 6, lg: 4 }}>
              <ConferenceCard conference={conference} />
            </Grid>
          ))}
        </Grid>
      )}
    </Section>
  );
}
