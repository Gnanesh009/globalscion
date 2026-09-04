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
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { getErrorMessage } from '@/api/apiClient';
import { useToast } from '@/app/ToastProvider';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Seo } from '@/components/common/Seo';
import { StatusChip } from '@/components/common/StatusChip';
import { EmptyState, ErrorState } from '@/components/common/States';
import { RHFSelect, RHFTextField } from '@/components/forms';
import { PUBLISH_STATUS_OPTIONS } from '@/constants';
import { useCategories, useCategoryMutations } from '@/hooks/useResources';
import type { Category } from '@/types';
import { slugify } from '@/utils/format';
import { publishMeta } from '@/utils/statusMeta';
import Skeleton from '@mui/material/Skeleton';

const schema = z.object({
  name: z.string().min(3, 'Enter a category name.'),
  slug: z.string().min(2, 'Enter a slug.'),
  description: z.string().min(20, 'Describe the category in at least 20 characters.'),
  display_order: z.coerce.number().int().min(1),
  status: z.enum(['draft', 'published', 'archived']),
});

type CategoryFormValues = z.infer<typeof schema>;

export default function AdminCategoriesPage() {
  const toast = useToast();
  const { data, isPending, isError, error, refetch } = useCategories();
  const { create, update, remove } = useCategoryMutations();
  const [editing, setEditing] = useState<Category | null>(null);
  const [open, setOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Category | null>(null);

  const methods = useForm<CategoryFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', slug: '', description: '', display_order: 1, status: 'published' },
  });

  useEffect(() => {
    if (!open) return;
    methods.reset({
      name: editing?.name ?? '',
      slug: editing?.slug ?? '',
      description: editing?.description ?? '',
      display_order: editing?.display_order ?? (data?.results.length ?? 0) + 1,
      status: editing?.status ?? 'published',
    });
  }, [open, editing, data?.results.length, methods]);

  const onSubmit = methods.handleSubmit(async (values) => {
    try {
      const payload = { ...values, icon: editing?.icon ?? null, color: editing?.color ?? null, conference_count: editing?.conference_count ?? 0 };
      if (editing) {
        await update.mutateAsync({ id: editing.id, payload });
        toast.success('Category updated.');
      } else {
        await create.mutateAsync(payload as Omit<Category, 'id'>);
        toast.success('Category created.');
      }
      setOpen(false);
      setEditing(null);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  });

  const categories = data?.results ?? [];

  return (
    <>
      <Seo title="Categories" noIndex />

      <AdminPageHeader
        title="Categories"
        description="Scientific disciplines used to group conferences. Categories drive the header mega menu, the homepage grid and the public listing filters."
        breadcrumb={[{ label: 'Categories' }]}
        actions={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            New category
          </Button>
        }
      />

      {isError && <ErrorState error={error} onRetry={() => void refetch()} />}

      {isPending ? (
        <Grid container spacing={2}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, lg: 4 }}>
              <Skeleton variant="rectangular" height={168} />
            </Grid>
          ))}
        </Grid>
      ) : categories.length === 0 ? (
        <EmptyState title="No categories yet" description="Create your first category to group conferences." />
      ) : (
        <Grid container spacing={2}>
          {categories.map((category) => (
            <Grid key={category.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <Card sx={{ p: 2.5, height: '100%' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="h4" component="h2" noWrap>
                      {category.name}
                    </Typography>
                    <Typography variant="caption" color="text.disabled">
                      /{category.slug} · order {category.display_order}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={0.25}>
                    <IconButton
                      size="small"
                      aria-label={`Edit ${category.name}`}
                      onClick={() => {
                        setEditing(category);
                        setOpen(true);
                      }}
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      aria-label={`Delete ${category.name}`}
                      onClick={() => setPendingDelete(category)}
                    >
                      <DeleteOutlineIcon fontSize="small" color="error" />
                    </IconButton>
                  </Stack>
                </Stack>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, minHeight: 60 }}>
                  {category.description}
                </Typography>

                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2 }}>
                  <StatusChip meta={publishMeta(category.status)} />
                  <Typography variant="caption" color="text.secondary">
                    {category.conference_count} published{' '}
                    {category.conference_count === 1 ? 'conference' : 'conferences'}
                  </Typography>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>{editing ? 'Edit category' : 'New category'}</DialogTitle>
        <FormProvider {...methods}>
          <form onSubmit={onSubmit} noValidate>
            <DialogContent dividers>
              <Grid container spacing={2.5}>
                <Grid size={12}>
                  <RHFTextField<CategoryFormValues>
                    name="name"
                    label="Name"
                    required
                    onBlur={() => {
                      if (!methods.getValues('slug')) {
                        methods.setValue('slug', slugify(methods.getValues('name')));
                      }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 8 }}>
                  <RHFTextField<CategoryFormValues> name="slug" label="Slug" required />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <RHFTextField<CategoryFormValues> name="display_order" label="Display order" type="number" />
                </Grid>
                <Grid size={12}>
                  <RHFTextField<CategoryFormValues>
                    name="description"
                    label="Description"
                    multiline
                    minRows={3}
                    required
                  />
                </Grid>
                <Grid size={12}>
                  <RHFSelect<CategoryFormValues> name="status" label="Status" options={PUBLISH_STATUS_OPTIONS} />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button onClick={() => setOpen(false)} color="inherit">
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={methods.formState.isSubmitting}>
                {editing ? 'Save changes' : 'Create category'}
              </Button>
            </DialogActions>
          </form>
        </FormProvider>
      </Dialog>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this category?"
        description={
          <>
            <strong>{pendingDelete?.name}</strong> will be removed. Conferences assigned to it keep their
            data but will need reassigning.
          </>
        }
        destructive
        confirmLabel="Delete category"
        loading={remove.isPending}
        onClose={() => setPendingDelete(null)}
        onConfirm={async () => {
          if (!pendingDelete) return;
          try {
            await remove.mutateAsync(pendingDelete.id);
            toast.success('Category deleted.');
          } catch (err) {
            toast.error(getErrorMessage(err));
          }
          setPendingDelete(null);
        }}
      />
    </>
  );
}
