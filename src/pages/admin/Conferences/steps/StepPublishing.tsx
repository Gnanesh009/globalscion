import { useFormContext } from 'react-hook-form';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { SITE_URL } from '@/api/apiClient';
import { RHFSelect, RHFSwitch } from '@/components/forms';
import { PUBLISH_STATUS_OPTIONS } from '@/constants';
import { formatDateRange } from '@/utils/format';
import type { ConferenceFormValues } from '../builderSchema';

interface Readiness {
  label: string;
  ok: boolean;
  hint: string;
}

export function StepPublishing() {
  const { watch } = useFormContext<ConferenceFormValues>();
  const values = watch();

  const checks: Readiness[] = [
    { label: 'Title and slug', ok: Boolean(values.title && values.slug), hint: 'Step 1' },
    { label: 'Category selected', ok: Boolean(values.category_id), hint: 'Step 1' },
    { label: 'Short description', ok: values.short_description.length >= 40, hint: 'Step 1' },
    { label: 'Full description', ok: values.description.replace(/<[^>]*>/g, '').trim().length > 80, hint: 'Step 1' },
    { label: 'Dates and venue', ok: Boolean(values.start_date && values.end_date), hint: 'Step 2' },
    { label: 'Hero image', ok: Boolean(values.hero_image), hint: 'Step 3' },
    { label: 'At least one track', ok: values.key_themes.length > 0, hint: 'Step 4' },
    { label: 'At least one speaker', ok: values.speaker_ids.length > 0, hint: 'Step 5' },
    { label: 'Agenda started', ok: values.agenda.length > 0, hint: 'Step 6' },
    { label: 'SEO metadata', ok: Boolean(values.meta_title || values.title), hint: 'Step 10' },
  ];

  const blocking = checks.filter((check) => !check.ok);

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, lg: 7 }}>
        <Typography variant="h4" component="h3" sx={{ mb: 2 }}>
          Pre-publication checklist
        </Typography>
        <Card variant="outlined">
          <Stack divider={<Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }} />}>
            {checks.map((check) => (
              <Stack key={check.label} direction="row" spacing={1.5} alignItems="center" sx={{ p: 1.75 }}>
                {check.ok ? (
                  <CheckCircleOutlineIcon sx={{ fontSize: 19, color: 'success.main' }} />
                ) : (
                  <ErrorOutlineIcon sx={{ fontSize: 19, color: 'warning.main' }} />
                )}
                <Typography sx={{ flex: 1, fontSize: '0.9375rem', fontWeight: check.ok ? 500 : 700 }}>
                  {check.label}
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  {check.hint}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Card>

        {blocking.length > 0 && (
          <Alert severity="warning" sx={{ mt: 2, borderRadius: 1.5 }}>
            {blocking.length} {blocking.length === 1 ? 'item is' : 'items are'} incomplete. You can still
            publish, but the corresponding sections will be hidden on the public page.
          </Alert>
        )}
      </Grid>

      <Grid size={{ xs: 12, lg: 5 }}>
        <Typography variant="h4" component="h3" sx={{ mb: 2 }}>
          Publishing
        </Typography>
        <Stack spacing={2.5}>
          <RHFSelect<ConferenceFormValues>
            name="publish_status"
            label="Status"
            options={PUBLISH_STATUS_OPTIONS}
            helperText="Published conferences appear immediately on the public website."
          />
          <RHFSwitch<ConferenceFormValues>
            name="is_featured"
            label="Feature this conference"
            helperText="Featured conferences appear in the header mega menu and the homepage editorial block."
          />

          <Box sx={{ p: 2.5, borderRadius: 1.5, backgroundColor: 'grey.50', border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mb: 0.5 }}>
              Public URL
            </Typography>
            <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', wordBreak: 'break-all' }}>
              {SITE_URL.replace(/\/$/, '')}/conferences/{values.slug || 'your-slug'}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
              {formatDateRange(values.start_date, values.end_date)} ·{' '}
              {values.city || 'Online'}
              {values.country ? `, ${values.country}` : ''}
            </Typography>
          </Box>
        </Stack>
      </Grid>
    </Grid>
  );
}
