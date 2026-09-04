import { useFormContext } from 'react-hook-form';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { SITE_URL } from '@/api/apiClient';
import { MediaPickerField } from '@/components/admin/MediaPickerField';
import { RHFTextField } from '@/components/forms';
import type { ConferenceFormValues } from '../builderSchema';

export function StepSeo() {
  const { watch, setValue } = useFormContext<ConferenceFormValues>();
  const title = watch('meta_title') || watch('title');
  const description = watch('meta_description') || watch('short_description');
  const slug = watch('slug');

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, lg: 7 }}>
        <Stack spacing={2.5}>
          <RHFTextField<ConferenceFormValues>
            name="meta_title"
            label="Meta title"
            counterMax={60}
            placeholder="Falls back to the conference title"
          />
          <RHFTextField<ConferenceFormValues>
            name="meta_description"
            label="Meta description"
            multiline
            minRows={3}
            counterMax={160}
            placeholder="Falls back to the short description"
          />
          <MediaPickerField
            label="Open Graph image"
            value={watch('og_image')}
            onChange={(url) => setValue('og_image', url, { shouldDirty: true })}
            helperText="Used when the page is shared on social platforms. 1200 × 630 works best. Falls back to the hero image."
          />
        </Stack>
      </Grid>

      <Grid size={{ xs: 12, lg: 5 }}>
        <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
          Search result preview
        </Typography>
        <Box
          sx={{
            p: 2.5,
            borderRadius: 1.5,
            border: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
          }}
        >
          <Typography sx={{ fontSize: '0.75rem', color: '#0A5D66' }}>
            {SITE_URL.replace(/^https?:\/\//, '')} › conferences › {slug || 'your-slug'}
          </Typography>
          <Typography
            sx={{
              mt: 0.5,
              fontSize: '1.125rem',
              color: '#1a0dab',
              lineHeight: 1.3,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {title || 'Conference title'}
          </Typography>
          <Typography
            sx={{
              mt: 0.75,
              fontSize: '0.8125rem',
              color: '#4d5156',
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {description || 'Your meta description appears here.'}
          </Typography>
        </Box>

        <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 2 }}>
          The public page also emits schema.org Event structured data — dates, venue, attendance mode and
          speakers are generated from the fields in the earlier steps.
        </Typography>
      </Grid>
    </Grid>
  );
}
