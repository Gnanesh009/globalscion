import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid2';
import { getErrorMessage } from '@/api/apiClient';
import { useToast } from '@/app/ToastProvider';
import { MediaPickerField } from '@/components/admin/MediaPickerField';
import { RHFSelect, RHFSwitch, RHFTextField } from '@/components/forms';
import { COUNTRIES, PUBLISH_STATUS_OPTIONS } from '@/constants';
import { useSpeakerMutations } from '@/hooks/useResources';
import type { Speaker } from '@/types';

const schema = z.object({
  name: z.string().min(3, 'Enter the speaker’s full name.'),
  designation: z.string().min(2, 'Enter their role or title.'),
  institution: z.string().min(2, 'Enter their institution.'),
  country: z.string().min(1, 'Select a country.'),
  biography: z.string().min(40, 'Write at least a short paragraph (40 characters).'),
  photo: z.string().nullable().default(null),
  website: z.string().url('Enter a valid URL.').or(z.literal('')).nullable().default(''),
  linkedin: z.string().url('Enter a valid URL.').or(z.literal('')).nullable().default(''),
  status: z.enum(['draft', 'published', 'archived']),
  is_keynote: z.boolean().default(false),
});

type SpeakerFormValues = z.infer<typeof schema>;

const toValues = (speaker: Speaker | null): SpeakerFormValues => ({
  name: speaker?.name ?? '',
  designation: speaker?.designation ?? '',
  institution: speaker?.institution ?? '',
  country: speaker?.country ?? '',
  biography: speaker?.biography ?? '',
  photo: speaker?.photo ?? null,
  website: speaker?.website ?? '',
  linkedin: speaker?.linkedin ?? '',
  status: speaker?.status ?? 'published',
  is_keynote: speaker?.is_keynote ?? false,
});

interface SpeakerFormDialogProps {
  open: boolean;
  speaker: Speaker | null;
  onClose: () => void;
  onCreated?: (speaker: Speaker) => void;
}

export function SpeakerFormDialog({ open, speaker, onClose, onCreated }: SpeakerFormDialogProps) {
  const toast = useToast();
  const { create, update } = useSpeakerMutations();

  const methods = useForm<SpeakerFormValues>({
    resolver: zodResolver(schema),
    defaultValues: toValues(speaker),
  });

  useEffect(() => {
    if (open) methods.reset(toValues(speaker));
  }, [open, speaker, methods]);

  const onSubmit = methods.handleSubmit(async (values) => {
    try {
      const payload = {
        ...values,
        website: values.website || null,
        linkedin: values.linkedin || null,
      } as Omit<Speaker, 'id'>;

      if (speaker) {
        await update.mutateAsync({ id: speaker.id, payload });
        toast.success('Speaker updated.');
      } else {
        const created = await create.mutateAsync(payload);
        onCreated?.(created);
        toast.success('Speaker created.');
      }
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>{speaker ? 'Edit speaker' : 'Add a speaker'}</DialogTitle>
      <FormProvider {...methods}>
        <form onSubmit={onSubmit} noValidate>
          <DialogContent dividers>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, md: 4 }}>
                <MediaPickerField
                  label="Photograph"
                  ratio="1 / 1"
                  value={methods.watch('photo')}
                  onChange={(url) => methods.setValue('photo', url, { shouldDirty: true })}
                  helperText="Square crop, at least 480px."
                />
              </Grid>

              <Grid size={{ xs: 12, md: 8 }}>
                <Grid container spacing={2.5}>
                  <Grid size={12}>
                    <RHFTextField<SpeakerFormValues> name="name" label="Full name" required />
                  </Grid>
                  <Grid size={12}>
                    <RHFTextField<SpeakerFormValues>
                      name="designation"
                      label="Designation"
                      placeholder="e.g. Professor of Developmental Neuroscience"
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 7 }}>
                    <RHFTextField<SpeakerFormValues> name="institution" label="Institution" required />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 5 }}>
                    <RHFSelect<SpeakerFormValues>
                      name="country"
                      label="Country"
                      placeholder="Select"
                      options={COUNTRIES.map((country) => ({ value: country, label: country }))}
                      required
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid size={12}>
                <RHFTextField<SpeakerFormValues>
                  name="biography"
                  label="Biography"
                  multiline
                  minRows={4}
                  counterMax={800}
                  required
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <RHFTextField<SpeakerFormValues> name="website" label="Website" placeholder="https://" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <RHFTextField<SpeakerFormValues> name="linkedin" label="LinkedIn" placeholder="https://" />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <RHFSelect<SpeakerFormValues> name="status" label="Status" options={PUBLISH_STATUS_OPTIONS} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex', alignItems: 'center' }}>
                <RHFSwitch<SpeakerFormValues>
                  name="is_keynote"
                  label="Keynote speaker"
                  helperText="Adds a keynote badge on conference pages."
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={onClose} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={methods.formState.isSubmitting}>
              {methods.formState.isSubmitting ? 'Saving…' : speaker ? 'Save changes' : 'Create speaker'}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
}
