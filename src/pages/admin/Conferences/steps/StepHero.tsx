import { useFormContext } from 'react-hook-form';
import Grid from '@mui/material/Grid2';
import { MediaPickerField } from '@/components/admin/MediaPickerField';
import { RHFTextField } from '@/components/forms';
import type { ConferenceFormValues } from '../builderSchema';

export function StepHero() {
  const { watch, setValue } = useFormContext<ConferenceFormValues>();

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 7 }}>
        <MediaPickerField
          label="Hero image"
          value={watch('hero_image')}
          onChange={(url) => setValue('hero_image', url, { shouldDirty: true })}
          helperText="Displayed full-width behind the conference title. Landscape, at least 1600px wide."
        />
      </Grid>

      <Grid size={{ xs: 12, md: 5 }}>
        <MediaPickerField
          label="Card image"
          ratio="3 / 2"
          value={watch('card_image')}
          onChange={(url) => setValue('card_image', url, { shouldDirty: true })}
          helperText="Used on listing cards and in the mega menu. Falls back to the hero image."
        />
      </Grid>

      <Grid size={12}>
        <RHFTextField<ConferenceFormValues>
          name="hero_subtitle"
          label="Hero subtitle"
          placeholder="A single line summarising the theme of the edition."
          multiline
          minRows={2}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 4 }}>
        <RHFTextField<ConferenceFormValues> name="hero_cta_label" label="Primary CTA label" required />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <RHFTextField<ConferenceFormValues>
          name="hero_cta_url"
          label="Primary CTA link"
          placeholder="#registration"
          helperText="Leave as an anchor to scroll to the registration section."
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <RHFTextField<ConferenceFormValues>
          name="brochure_url"
          label="Brochure URL"
          placeholder="/brochures/example.pdf"
          helperText="Optional — adds a Download brochure button."
        />
      </Grid>
    </Grid>
  );
}
