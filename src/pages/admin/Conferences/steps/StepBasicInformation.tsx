import { useFormContext } from 'react-hook-form';
import Grid from '@mui/material/Grid2';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { RHFSelect, RHFTextField } from '@/components/forms';
import { CONFERENCE_KIND_OPTIONS } from '@/constants';
import { useCategories } from '@/hooks/useResources';
import { slugify } from '@/utils/format';
import type { ConferenceFormValues } from '../builderSchema';

export function StepBasicInformation() {
  const { watch, setValue, formState } = useFormContext<ConferenceFormValues>();
  const { data: categories } = useCategories();

  const title = watch('title');
  const description = watch('description');

  return (
    <Grid container spacing={2.5}>
      <Grid size={12}>
        <RHFTextField<ConferenceFormValues>
          name="title"
          label="Conference title"
          placeholder="International Conference on …"
          required
        />
      </Grid>

      <Grid size={{ xs: 12, md: 7 }}>
        <Stack direction="row" spacing={1} alignItems="flex-start">
          <RHFTextField<ConferenceFormValues>
            name="slug"
            label="URL slug"
            helperText="The public page will be /conferences/{slug}"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ '& p': { fontSize: '0.8125rem' } }}>
                  /conferences/
                </InputAdornment>
              ),
            }}
            required
          />
          <Button
            onClick={() => setValue('slug', slugify(title), { shouldValidate: true, shouldDirty: true })}
            startIcon={<AutoFixHighIcon />}
            disabled={!title}
            sx={{ mt: 1, flexShrink: 0 }}
          >
            From title
          </Button>
        </Stack>
      </Grid>

      <Grid size={{ xs: 12, md: 5 }}>
        <RHFSelect<ConferenceFormValues>
          name="kind"
          label="Event type"
          options={CONFERENCE_KIND_OPTIONS}
          required
        />
      </Grid>

      <Grid size={{ xs: 12, md: 5 }}>
        <RHFSelect<ConferenceFormValues>
          name="category_id"
          label="Category"
          placeholder="Select a category"
          options={(categories?.results ?? []).map((category) => ({
            value: category.id,
            label: category.name,
          }))}
          required
        />
      </Grid>

      <Grid size={{ xs: 12, md: 7 }}>
        <RHFTextField<ConferenceFormValues>
          name="theme_line"
          label="Conference theme"
          placeholder="e.g. Next-Generation Autism Research: Science, Technology and Care"
          helperText="Displayed under the title in the hero and as the overview heading."
        />
      </Grid>

      <Grid size={12}>
        <RHFTextField<ConferenceFormValues>
          name="short_description"
          label="Short description"
          multiline
          minRows={2}
          counterMax={320}
          placeholder="One or two sentences used on conference cards, the mega menu and search results."
          required
        />
      </Grid>

      <Grid size={12}>
        <RichTextEditor
          label="Full description"
          value={description}
          onChange={(html) => setValue('description', html, { shouldDirty: true, shouldValidate: true })}
          placeholder="Introduce the conference, its scope and what delegates can expect…"
          error={Boolean(formState.errors.description)}
          helperText={formState.errors.description?.message as string | undefined}
          minHeight={340}
        />
      </Grid>
    </Grid>
  );
}
