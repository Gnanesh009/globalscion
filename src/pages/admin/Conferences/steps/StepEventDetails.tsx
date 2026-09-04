import { useFormContext } from 'react-hook-form';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid2';
import { RHFDatePicker, RHFSelect, RHFTextField } from '@/components/forms';
import { COUNTRIES, EVENT_FORMAT_OPTIONS, TIMEZONES } from '@/constants';
import type { ConferenceFormValues } from '../builderSchema';

export function StepEventDetails() {
  const { watch } = useFormContext<ConferenceFormValues>();
  const format = watch('event_format');
  const isOnline = format === 'online';

  return (
    <Grid container spacing={2.5}>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <RHFDatePicker<ConferenceFormValues> name="start_date" label="Start date" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <RHFDatePicker<ConferenceFormValues> name="end_date" label="End date" minDate={watch('start_date')} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <RHFSelect<ConferenceFormValues>
          name="timezone"
          label="Timezone"
          options={TIMEZONES.map((zone) => ({ value: zone, label: zone }))}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <RHFSelect<ConferenceFormValues>
          name="event_format"
          label="Attendance format"
          options={EVENT_FORMAT_OPTIONS}
        />
      </Grid>

      <Grid size={12}>
        <Alert severity="info" sx={{ borderRadius: 1.5 }}>
          {isOnline
            ? 'Online editions show “Online” as the location on the public page. The venue field is used for the platform name.'
            : 'The venue and city appear in the hero, on conference cards and in the structured data used by search engines.'}
        </Alert>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <RHFTextField<ConferenceFormValues>
          name="venue"
          label={isOnline ? 'Platform' : 'Venue'}
          placeholder={isOnline ? 'GlobalScion live platform' : 'e.g. RAI Amsterdam Convention Centre'}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <RHFTextField<ConferenceFormValues> name="city" label="City" placeholder={isOnline ? 'Online' : 'e.g. Amsterdam'} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <RHFSelect<ConferenceFormValues>
          name="country"
          label="Country"
          placeholder="Select a country"
          options={[
            { value: 'Global', label: 'Global (online)' },
            ...COUNTRIES.map((country) => ({ value: country, label: country })),
          ]}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <RHFDatePicker<ConferenceFormValues>
          name="abstract_deadline"
          label="Abstract submission deadline"
          helperText="Shown as a countdown on the abstract section."
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <RHFDatePicker<ConferenceFormValues>
          name="registration_deadline"
          label="Registration deadline"
          helperText="Shown on the registration banner."
        />
      </Grid>
    </Grid>
  );
}
