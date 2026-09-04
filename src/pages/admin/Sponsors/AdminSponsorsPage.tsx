import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid2';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { getErrorMessage } from '@/api/apiClient';
import { useToast } from '@/app/ToastProvider';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { MediaPickerField } from '@/components/admin/MediaPickerField';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Seo } from '@/components/common/Seo';
import { StatusChip } from '@/components/common/StatusChip';
import { EmptyState, ErrorState } from '@/components/common/States';
import { RHFSelect, RHFTextField } from '@/components/forms';
import { PUBLISH_STATUS_OPTIONS, SPONSOR_TIER_OPTIONS } from '@/constants';
import { useSponsorMutations, useSponsors } from '@/hooks/useResources';
import { useDebounced } from '@/hooks/useUi';
import type { Sponsor } from '@/types';
import { publishMeta } from '@/utils/statusMeta';

const schema = z.object({
  name: z.string().min(2, 'Enter the organisation name.'),
  description: z.string().min(10, 'Add a short description.'),
  website: z.string().url('Enter a valid URL.').or(z.literal('')).default(''),
  logo: z.string().nullable().default(null),
  tier: z.enum(['platinum', 'gold', 'silver', 'partner', 'media']),
  status: z.enum(['draft', 'published', 'archived']),
});

type SponsorFormValues = z.infer<typeof schema>;

export default function AdminSponsorsPage() {
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [tier, setTier] = useState('all');
  const [editing, setEditing] = useState<Sponsor | null>(null);
  const [open, setOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Sponsor | null>(null);

  const debouncedSearch = useDebounced(search, 350);
  const { data, isPending, isError, error, refetch } = useSponsors({
    search: debouncedSearch || undefined,
    tier,
    page_size: 60,
  });
  const { create, update, remove } = useSponsorMutations();

  const methods = useForm<SponsorFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', description: '', website: '', logo: null, tier: 'gold', status: 'published' },
  });

  useEffect(() => {
    if (!open) return;
    methods.reset({
      name: editing?.name ?? '',
      description: editing?.description ?? '',
      website: editing?.website ?? '',
      logo: editing?.logo ?? null,
      tier: editing?.tier ?? 'gold',
      status: editing?.status ?? 'published',
    });
  }, [open, editing, methods]);

  const onSubmit = methods.handleSubmit(async (values) => {
    try {
      const payload = { ...values, website: values.website || null } as Omit<Sponsor, 'id'>;
      if (editing) {
        await update.mutateAsync({ id: editing.id, payload });
        toast.success('Sponsor updated.');
      } else {
        await create.mutateAsync(payload);
        toast.success('Sponsor created.');
      }
      setOpen(false);
      setEditing(null);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  });

  const sponsors = data?.results ?? [];

  return (
    <>
      <Seo title="Sponsors" noIndex />

      <AdminPageHeader
        title="Sponsors & partners"
        description="Organisations that support GlobalScion events. Attach them to individual conferences in step 7 of the conference builder."
        breadcrumb={[{ label: 'Sponsors' }]}
        actions={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            New sponsor
          </Button>
        }
      />

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 2.5 }}>
        <TextField
          size="small"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search sponsors"
          aria-label="Search sponsors"
          sx={{ flex: 1, maxWidth: 420 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          select
          size="small"
          label="Tier"
          value={tier}
          onChange={(event) => setTier(event.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="all">All tiers</MenuItem>
          {SPONSOR_TIER_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      {isError && <ErrorState error={error} onRetry={() => void refetch()} />}

      {isPending ? (
        <Grid container spacing={2}>
          {Array.from({ length: 8 }).map((_, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
              <Skeleton variant="rectangular" height={160} />
            </Grid>
          ))}
        </Grid>
      ) : sponsors.length === 0 ? (
        <EmptyState title="No sponsors found" description="Adjust your filters or create a sponsor record." />
      ) : (
        <Grid container spacing={2}>
          {sponsors.map((sponsor) => (
            <Grid key={sponsor.id} size={{ xs: 12, sm: 6, lg: 3 }}>
              <Card sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box
                  sx={{
                    height: 62,
                    display: 'grid',
                    placeItems: 'center',
                    mb: 2,
                    borderRadius: 1.5,
                    backgroundColor: 'grey.50',
                    px: 1.5,
                  }}
                >
                  {sponsor.logo ? (
                    <Box
                      component="img"
                      src={sponsor.logo}
                      alt={sponsor.name}
                      sx={{ maxHeight: 44, maxWidth: '100%', objectFit: 'contain' }}
                    />
                  ) : (
                    <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', textAlign: 'center' }}>
                      {sponsor.name}
                    </Typography>
                  )}
                </Box>

                <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem' }}>{sponsor.name}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, flex: 1 }}>
                  {sponsor.description}
                </Typography>

                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
                  <Stack direction="row" spacing={0.75}>
                    <StatusChip meta={publishMeta(sponsor.status)} />
                    <StatusChip
                      meta={{
                        label: SPONSOR_TIER_OPTIONS.find((o) => o.value === sponsor.tier)?.label ?? sponsor.tier,
                        tone: 'primary',
                      }}
                    />
                  </Stack>
                  <Stack direction="row" spacing={0.25}>
                    <IconButton
                      size="small"
                      aria-label={`Edit ${sponsor.name}`}
                      onClick={() => {
                        setEditing(sponsor);
                        setOpen(true);
                      }}
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      aria-label={`Delete ${sponsor.name}`}
                      onClick={() => setPendingDelete(sponsor)}
                    >
                      <DeleteOutlineIcon fontSize="small" color="error" />
                    </IconButton>
                  </Stack>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>{editing ? 'Edit sponsor' : 'New sponsor'}</DialogTitle>
        <FormProvider {...methods}>
          <form onSubmit={onSubmit} noValidate>
            <DialogContent dividers>
              <Grid container spacing={2.5}>
                <Grid size={12}>
                  <MediaPickerField
                    label="Logo"
                    ratio="3 / 1"
                    value={methods.watch('logo')}
                    onChange={(url) => methods.setValue('logo', url, { shouldDirty: true })}
                    helperText="Optional — a typographic mark is used when no logo is set."
                  />
                </Grid>
                <Grid size={12}>
                  <RHFTextField<SponsorFormValues> name="name" label="Organisation name" required />
                </Grid>
                <Grid size={12}>
                  <RHFTextField<SponsorFormValues>
                    name="description"
                    label="Description"
                    multiline
                    minRows={2}
                    required
                  />
                </Grid>
                <Grid size={12}>
                  <RHFTextField<SponsorFormValues> name="website" label="Website" placeholder="https://" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <RHFSelect<SponsorFormValues> name="tier" label="Tier" options={SPONSOR_TIER_OPTIONS} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <RHFSelect<SponsorFormValues> name="status" label="Status" options={PUBLISH_STATUS_OPTIONS} />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button onClick={() => setOpen(false)} color="inherit">
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={methods.formState.isSubmitting}>
                {editing ? 'Save changes' : 'Create sponsor'}
              </Button>
            </DialogActions>
          </form>
        </FormProvider>
      </Dialog>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this sponsor?"
        description={<><strong>{pendingDelete?.name}</strong> will be removed from every conference page.</>}
        destructive
        confirmLabel="Delete sponsor"
        loading={remove.isPending}
        onClose={() => setPendingDelete(null)}
        onConfirm={async () => {
          if (!pendingDelete) return;
          try {
            await remove.mutateAsync(pendingDelete.id);
            toast.success('Sponsor deleted.');
          } catch (err) {
            toast.error(getErrorMessage(err));
          }
          setPendingDelete(null);
        }}
      />
    </>
  );
}
