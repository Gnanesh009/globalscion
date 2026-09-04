import { useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import Avatar from '@mui/material/Avatar';
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
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { getErrorMessage } from '@/api/apiClient';
import { useToast } from '@/app/ToastProvider';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { MediaPickerField } from '@/components/admin/MediaPickerField';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Seo } from '@/components/common/Seo';
import { StatusChip } from '@/components/common/StatusChip';
import { ErrorState } from '@/components/common/States';
import { RHFSelect, RHFTextField } from '@/components/forms';
import { ADMIN_PAGE_SIZE, COUNTRIES, PUBLISH_STATUS_OPTIONS } from '@/constants';
import { useReviewMutations, useReviews } from '@/hooks/useResources';
import { useDebounced } from '@/hooks/useUi';
import type { Review } from '@/types';
import { formatDate, initialsOf } from '@/utils/format';
import { publishMeta } from '@/utils/statusMeta';

const schema = z.object({
  name: z.string().min(3, 'Enter the reviewer’s name.'),
  designation: z.string().min(2, 'Enter their role.'),
  organization: z.string().min(2, 'Enter their organisation.'),
  country: z.string().min(1, 'Select a country.'),
  review: z.string().min(40, 'Reviews should be at least 40 characters.'),
  rating: z.coerce.number().min(1).max(5),
  conference: z.string().default(''),
  photo: z.string().nullable().default(null),
  status: z.enum(['draft', 'published', 'archived']),
});

type ReviewFormValues = z.infer<typeof schema>;

export default function AdminReviewsPage() {
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(ADMIN_PAGE_SIZE);
  const [editing, setEditing] = useState<Review | null>(null);
  const [open, setOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Review | null>(null);

  const debouncedSearch = useDebounced(search, 400);
  const query = useMemo(
    () => ({ page: page + 1, page_size: pageSize, search: debouncedSearch || undefined, status }),
    [page, pageSize, debouncedSearch, status],
  );
  const { data, isFetching, isError, error, refetch } = useReviews(query);
  const { create, update, remove } = useReviewMutations();

  const methods = useForm<ReviewFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      designation: '',
      organization: '',
      country: '',
      review: '',
      rating: 5,
      conference: '',
      photo: null,
      status: 'published',
    },
  });

  useEffect(() => {
    if (!open) return;
    methods.reset({
      name: editing?.name ?? '',
      designation: editing?.designation ?? '',
      organization: editing?.organization ?? '',
      country: editing?.country ?? '',
      review: editing?.review ?? '',
      rating: editing?.rating ?? 5,
      conference: editing?.conference ?? '',
      photo: editing?.photo ?? null,
      status: editing?.status ?? 'published',
    });
  }, [open, editing, methods]);

  const onSubmit = methods.handleSubmit(async (values) => {
    try {
      const payload = {
        ...values,
        conference: values.conference || null,
        created_at: editing?.created_at ?? new Date().toISOString(),
      } as Omit<Review, 'id'>;

      if (editing) {
        await update.mutateAsync({ id: editing.id, payload });
        toast.success('Review updated.');
      } else {
        await create.mutateAsync(payload);
        toast.success('Review created.');
      }
      setOpen(false);
      setEditing(null);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  });

  const columns: GridColDef<Review>[] = [
    {
      field: 'name',
      headerName: 'Reviewer',
      flex: 0.8,
      minWidth: 230,
      renderCell: (params) => (
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ py: 1, minWidth: 0 }}>
          <Avatar src={params.row.photo ?? undefined} sx={{ width: 34, height: 34 }}>
            {initialsOf(params.row.name)}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 700 }} noWrap>
              {params.row.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
              {params.row.designation}, {params.row.organization}
            </Typography>
          </Box>
        </Stack>
      ),
    },
    {
      field: 'review',
      headerName: 'Review',
      flex: 1.2,
      minWidth: 280,
      renderCell: (params) => (
        <Tooltip title={params.row.review}>
          <Typography variant="body2" color="text.secondary" noWrap>
            {params.row.review}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: 'rating',
      headerName: 'Rating',
      width: 132,
      renderCell: (params) => <Rating value={params.row.rating} readOnly size="small" />,
    },
    { field: 'country', headerName: 'Country', width: 140 },
    {
      field: 'created_at',
      headerName: 'Received',
      width: 120,
      valueGetter: (_value, row) => formatDate(row.created_at),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 118,
      renderCell: (params) => <StatusChip meta={publishMeta(params.row.status)} />,
    },
    {
      field: 'actions',
      headerName: '',
      width: 130,
      sortable: false,
      align: 'right',
      renderCell: (params) => (
        <Stack direction="row" spacing={0.25}>
          {params.row.status !== 'published' && (
            <Tooltip title="Publish">
              <IconButton
                size="small"
                aria-label={`Publish review by ${params.row.name}`}
                onClick={async () => {
                  try {
                    await update.mutateAsync({ id: params.row.id, payload: { status: 'published' } });
                    toast.success('Review published.');
                  } catch (err) {
                    toast.error(getErrorMessage(err));
                  }
                }}
              >
                <PublicOutlinedIcon fontSize="small" color="success" />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Edit">
            <IconButton
              size="small"
              aria-label={`Edit review by ${params.row.name}`}
              onClick={() => {
                setEditing(params.row);
                setOpen(true);
              }}
            >
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              aria-label={`Delete review by ${params.row.name}`}
              onClick={() => setPendingDelete(params.row)}
            >
              <DeleteOutlineIcon fontSize="small" color="error" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <>
      <Seo title="Reviews" noIndex />

      <AdminPageHeader
        title="Delegate reviews"
        description="Feedback collected after each edition. Only published reviews appear on the public reviews page and the homepage."
        breadcrumb={[{ label: 'Reviews' }]}
        actions={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            New review
          </Button>
        }
      />

      <Card>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <TextField
            size="small"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(0);
            }}
            placeholder="Search reviewer, organisation or text"
            aria-label="Search reviews"
            sx={{ flex: 1 }}
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
            label="Status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="all">All statuses</MenuItem>
            {PUBLISH_STATUS_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Stack>

        {isError ? (
          <Box sx={{ p: 3 }}>
            <ErrorState error={error} onRetry={() => void refetch()} compact />
          </Box>
        ) : (
          <DataGrid
            rows={data?.results ?? []}
            columns={columns}
            rowCount={data?.count ?? 0}
            loading={isFetching}
            paginationMode="server"
            paginationModel={{ page, pageSize }}
            onPaginationModelChange={(model) => {
              setPage(model.page);
              setPageSize(model.pageSize);
            }}
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
            disableColumnMenu
            rowHeight={58}
            autoHeight
            localeText={{ noRowsLabel: 'No reviews match these filters.' }}
            sx={{
              border: 'none',
              '& .MuiDataGrid-columnHeaders': { backgroundColor: 'grey.50' },
              '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': { outline: 'none' },
            }}
          />
        )}
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>{editing ? 'Edit review' : 'New review'}</DialogTitle>
        <FormProvider {...methods}>
          <form onSubmit={onSubmit} noValidate>
            <DialogContent dividers>
              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <MediaPickerField
                    label="Photo"
                    ratio="1 / 1"
                    value={methods.watch('photo')}
                    onChange={(url) => methods.setValue('photo', url, { shouldDirty: true })}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 8 }}>
                  <Stack spacing={2.5}>
                    <RHFTextField<ReviewFormValues> name="name" label="Full name" required />
                    <RHFTextField<ReviewFormValues> name="designation" label="Designation" required />
                    <RHFTextField<ReviewFormValues> name="organization" label="Organisation" required />
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <RHFSelect<ReviewFormValues>
                    name="country"
                    label="Country"
                    placeholder="Select"
                    options={COUNTRIES.map((country) => ({ value: country, label: country }))}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Rating
                    </Typography>
                    <Rating
                      value={methods.watch('rating')}
                      onChange={(_, value) => methods.setValue('rating', value ?? 5)}
                    />
                  </Box>
                </Grid>

                <Grid size={12}>
                  <RHFTextField<ReviewFormValues>
                    name="conference"
                    label="Conference (optional)"
                    placeholder="e.g. World Congress on Heart & Cardiovascular Diseases"
                  />
                </Grid>
                <Grid size={12}>
                  <RHFTextField<ReviewFormValues>
                    name="review"
                    label="Review"
                    multiline
                    minRows={4}
                    counterMax={600}
                    required
                  />
                </Grid>
                <Grid size={12}>
                  <RHFSelect<ReviewFormValues> name="status" label="Status" options={PUBLISH_STATUS_OPTIONS} />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button onClick={() => setOpen(false)} color="inherit">
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={methods.formState.isSubmitting}>
                {editing ? 'Save changes' : 'Create review'}
              </Button>
            </DialogActions>
          </form>
        </FormProvider>
      </Dialog>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this review?"
        description={<>The review from <strong>{pendingDelete?.name}</strong> will be permanently removed.</>}
        destructive
        confirmLabel="Delete review"
        loading={remove.isPending}
        onClose={() => setPendingDelete(null)}
        onConfirm={async () => {
          if (!pendingDelete) return;
          try {
            await remove.mutateAsync(pendingDelete.id);
            toast.success('Review deleted.');
          } catch (err) {
            toast.error(getErrorMessage(err));
          }
          setPendingDelete(null);
        }}
      />
    </>
  );
}
