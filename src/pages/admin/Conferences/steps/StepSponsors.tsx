import { useFormContext } from 'react-hook-form';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid2';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { EmptyState } from '@/components/common/States';
import { SPONSOR_TIER_OPTIONS } from '@/constants';
import { useSponsors } from '@/hooks/useResources';
import type { ConferenceFormValues } from '../builderSchema';

export function StepSponsors() {
  const { watch, setValue } = useFormContext<ConferenceFormValues>();
  const selected = watch('sponsor_ids');
  const { data, isPending } = useSponsors({ page_size: 60, status: 'published' });

  const toggle = (id: string) =>
    setValue(
      'sponsor_ids',
      selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id],
      { shouldDirty: true },
    );

  const sponsors = data?.results ?? [];

  return (
    <>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
        Select the sponsors, collaborators and media partners to display on this conference page. They are
        grouped by tier automatically. Manage the sponsor records themselves under Sponsors.
      </Typography>

      <Chip size="small" color="primary" label={`${selected.length} selected`} sx={{ mb: 2.5, fontWeight: 700 }} />

      {isPending ? (
        <Grid container spacing={1.5}>
          {Array.from({ length: 8 }).map((_, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
              <Skeleton variant="rectangular" height={72} />
            </Grid>
          ))}
        </Grid>
      ) : sponsors.length === 0 ? (
        <EmptyState title="No sponsors available" description="Create sponsor records first." compact />
      ) : (
        SPONSOR_TIER_OPTIONS.map((tier) => {
          const tierSponsors = sponsors.filter((sponsor) => sponsor.tier === tier.value);
          if (!tierSponsors.length) return null;

          return (
            <Box key={tier.value} sx={{ mb: 3 }}>
              <Typography variant="eyebrow" component="h3" sx={{ color: 'text.disabled', mb: 1.5 }}>
                {tier.label}
              </Typography>
              <Grid container spacing={1.5}>
                {tierSponsors.map((sponsor) => {
                  const isSelected = selected.includes(sponsor.id);
                  return (
                    <Grid key={sponsor.id} size={{ xs: 12, sm: 6, md: 4 }}>
                      <Stack
                        component="label"
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{
                          p: 1.25,
                          cursor: 'pointer',
                          borderRadius: 1.5,
                          border: '1px solid',
                          borderColor: isSelected ? 'primary.main' : 'divider',
                          backgroundColor: isSelected ? 'rgba(37,99,235,0.04)' : 'background.paper',
                        }}
                      >
                        <Checkbox
                          checked={isSelected}
                          onChange={() => toggle(sponsor.id)}
                          inputProps={{ 'aria-label': `Select ${sponsor.name}` }}
                        />
                        <Box sx={{ minWidth: 0 }}>
                          <Typography sx={{ fontWeight: 700, fontSize: '0.875rem' }} noWrap>
                            {sponsor.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                            {sponsor.description}
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          );
        })
      )}
    </>
  );
}
