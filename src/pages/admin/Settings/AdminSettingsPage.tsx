import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid2';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { getErrorMessage } from '@/api/apiClient';
import { useToast } from '@/app/ToastProvider';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { MediaPickerField } from '@/components/admin/MediaPickerField';
import { Seo } from '@/components/common/Seo';
import { LoadingScreen, ErrorState } from '@/components/common/States';
import { RHFTextField } from '@/components/forms';
import { useSettings, useSettingsMutation } from '@/hooks/useResources';
import type { SiteSettings } from '@/types';

const schema = z.object({
  website_name: z.string().min(2, 'Enter the website name.'),
  tagline: z.string().min(2, 'Enter a tagline.'),
  logo: z.string().nullable().default(null),
  favicon: z.string().nullable().default(null),
  contact_email: z.string().email('Enter a valid email address.'),
  support_email: z.string().email('Enter a valid email address.'),
  phone: z.string().min(4, 'Enter a phone number.'),
  address: z.string().min(6, 'Enter the head office address.'),
  offices: z
    .array(z.object({ country: z.string().min(2), address: z.string().min(4) }))
    .default([]),
  social: z.object({
    facebook: z.string().url('Enter a valid URL.').or(z.literal('')),
    twitter: z.string().url('Enter a valid URL.').or(z.literal('')),
    instagram: z.string().url('Enter a valid URL.').or(z.literal('')),
    linkedin: z.string().url('Enter a valid URL.').or(z.literal('')),
    youtube: z.string().url('Enter a valid URL.').or(z.literal('')),
  }),
  footer_description: z.string().min(20, 'Write a short paragraph for the footer.'),
  default_seo: z.object({
    meta_title: z.string().min(2),
    meta_description: z.string().min(2),
    og_image: z.string().nullable().default(null),
  }),
});

type SettingsFormValues = z.infer<typeof schema>;

export default function AdminSettingsPage() {
  const toast = useToast();
  const { data, isPending, isError, error, refetch } = useSettings();
  const save = useSettingsMutation();

  const methods = useForm<SettingsFormValues>({
    resolver: zodResolver(schema),
    defaultValues: data as SettingsFormValues,
  });

  const { fields, append, remove } = useFieldArray({ control: methods.control, name: 'offices' });

  useEffect(() => {
    if (data) methods.reset(data as SettingsFormValues);
  }, [data, methods]);

  const onSubmit = methods.handleSubmit(async (values) => {
    try {
      await save.mutateAsync(values as Partial<SiteSettings>);
      toast.success('Settings saved.');
      methods.reset(values);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  });

  if (isPending) return <LoadingScreen label="Loading settings" />;
  if (isError) {
    return (
      <>
        <AdminPageHeader title="Settings" breadcrumb={[{ label: 'Settings' }]} />
        <ErrorState error={error} onRetry={() => void refetch()} />
      </>
    );
  }

  return (
    <>
      <Seo title="Settings" noIndex />

      <AdminPageHeader
        title="Settings"
        description="Global configuration used across the public website — identity, contact details, social links, footer copy and default SEO."
        breadcrumb={[{ label: 'Settings' }]}
        actions={
          <Button
            variant="contained"
            startIcon={<SaveOutlinedIcon />}
            disabled={!methods.formState.isDirty || save.isPending}
            onClick={onSubmit}
          >
            {save.isPending ? 'Saving…' : 'Save settings'}
          </Button>
        }
      />

      <FormProvider {...methods}>
        <Box component="form" onSubmit={onSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, lg: 6 }}>
              <Card>
                <CardHeader title="Identity" />
                <CardContent>
                  <Stack spacing={2.5}>
                    <RHFTextField<SettingsFormValues> name="website_name" label="Website name" />
                    <RHFTextField<SettingsFormValues> name="tagline" label="Tagline" />
                    <Grid container spacing={2}>
                      <Grid size={6}>
                        <MediaPickerField
                          label="Logo"
                          ratio="3 / 1"
                          value={methods.watch('logo')}
                          onChange={(url) => methods.setValue('logo', url, { shouldDirty: true })}
                        />
                      </Grid>
                      <Grid size={6}>
                        <MediaPickerField
                          label="Favicon"
                          ratio="1 / 1"
                          value={methods.watch('favicon')}
                          onChange={(url) => methods.setValue('favicon', url, { shouldDirty: true })}
                        />
                      </Grid>
                    </Grid>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, lg: 6 }}>
              <Card>
                <CardHeader title="Contact" />
                <CardContent>
                  <Stack spacing={2.5}>
                    <RHFTextField<SettingsFormValues> name="contact_email" label="General email" />
                    <RHFTextField<SettingsFormValues> name="support_email" label="Support email" />
                    <RHFTextField<SettingsFormValues> name="phone" label="Telephone" />
                    <RHFTextField<SettingsFormValues> name="address" label="Head office address" multiline minRows={2} />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, lg: 6 }}>
              <Card>
                <CardHeader
                  title="Regional offices"
                  action={
                    <Button
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => append({ country: '', address: '' })}
                    >
                      Add office
                    </Button>
                  }
                />
                <CardContent>
                  <Stack spacing={2}>
                    {fields.map((field, index) => (
                      <Stack key={field.id} direction="row" spacing={1.5} alignItems="flex-start">
                        <TextField
                          size="small"
                          label="Country"
                          sx={{ width: 160 }}
                          {...methods.register(`offices.${index}.country`)}
                        />
                        <TextField
                          size="small"
                          label="Address"
                          fullWidth
                          {...methods.register(`offices.${index}.address`)}
                        />
                        <IconButton
                          aria-label={`Remove office ${index + 1}`}
                          onClick={() => remove(index)}
                          sx={{ mt: 0.5 }}
                        >
                          <DeleteOutlineIcon fontSize="small" color="error" />
                        </IconButton>
                      </Stack>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, lg: 6 }}>
              <Card>
                <CardHeader title="Social media" />
                <CardContent>
                  <Stack spacing={2.5}>
                    {(['linkedin', 'twitter', 'facebook', 'instagram', 'youtube'] as const).map((key) => (
                      <RHFTextField<SettingsFormValues>
                        key={key}
                        name={`social.${key}`}
                        label={key[0].toUpperCase() + key.slice(1)}
                        placeholder="https://"
                      />
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, lg: 6 }}>
              <Card>
                <CardHeader title="Footer" />
                <CardContent>
                  <RHFTextField<SettingsFormValues>
                    name="footer_description"
                    label="Footer description"
                    multiline
                    minRows={4}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, lg: 6 }}>
              <Card>
                <CardHeader title="Default SEO" subheader="Used when a page has no metadata of its own" />
                <CardContent>
                  <Stack spacing={2.5}>
                    <RHFTextField<SettingsFormValues> name="default_seo.meta_title" label="Default meta title" />
                    <RHFTextField<SettingsFormValues>
                      name="default_seo.meta_description"
                      label="Default meta description"
                      multiline
                      minRows={3}
                    />
                    <MediaPickerField
                      label="Default Open Graph image"
                      value={methods.watch('default_seo.og_image')}
                      onChange={(url) => methods.setValue('default_seo.og_image', url, { shouldDirty: true })}
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </FormProvider>
    </>
  );
}
