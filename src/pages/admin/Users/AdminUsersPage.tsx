import { useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid2';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { getErrorMessage } from '@/api/apiClient';
import { useAuth } from '@/app/AuthProvider';
import { useToast } from '@/app/ToastProvider';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Seo } from '@/components/common/Seo';
import { ErrorState } from '@/components/common/States';
import { RHFSelect, RHFTextField } from '@/components/forms';
import { ADMIN_PAGE_SIZE, USER_ROLE_OPTIONS } from '@/constants';
import { useUserMutations, useUsers } from '@/hooks/useResources';
import { useDebounced } from '@/hooks/useUi';
import type { AdminUser } from '@/types';
import { formatDate, fromNow, initialsOf } from '@/utils/format';

const schema = z.object({
  first_name: z.string().min(2, 'Enter a first name.'),
  last_name: z.string().min(2, 'Enter a last name.'),
  email: z.string().email('Enter a valid email address.'),
  role: z.enum(['super_admin', 'admin', 'editor']),
  is_active: z.boolean().default(true),
});

type UserFormValues = z.infer<typeof schema>;

const ROLE_COLOR: Record<AdminUser['role'], 'default' | 'primary' | 'secondary'> = {
  super_admin: 'secondary',
  admin: 'primary',
  editor: 'default',
};

export default function AdminUsersPage() {
  const toast = useToast();
  const { user: currentUser } = useAuth();
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('all');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(ADMIN_PAGE_SIZE);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [open, setOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<AdminUser | null>(null);

  const debouncedSearch = useDebounced(search, 400);
  const query = useMemo(
    () => ({ page: page + 1, page_size: pageSize, search: debouncedSearch || undefined, role }),
    [page, pageSize, debouncedSearch, role],
  );
  const { data, isFetching, isError, error, refetch } = useUsers(query);
  const { create, update, remove } = useUserMutations();

  const methods = useForm<UserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { first_name: '', last_name: '', email: '', role: 'editor', is_active: true },
  });

  useEffect(() => {
    if (!open) return;
    methods.reset({
      first_name: editing?.first_name ?? '',
      last_name: editing?.last_name ?? '',
      email: editing?.email ?? '',
      role: editing?.role ?? 'editor',
      is_active: editing?.is_active ?? true,
    });
  }, [open, editing, methods]);

  const onSubmit = methods.handleSubmit(async (values) => {
    try {
      if (editing) {
        await update.mutateAsync({ id: editing.id, payload: values });
        toast.success('User updated.');
      } else {
        await create.mutateAsync({
          ...values,
          avatar: null,
          last_login: null,
          date_joined: new Date().toISOString(),
        } as Omit<AdminUser, 'id'>);
        toast.success('User created — an invitation email has been sent.');
      }
      setOpen(false);
      setEditing(null);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  });

  const columns: GridColDef<AdminUser>[] = [
    {
      field: 'first_name',
      headerName: 'User',
      flex: 1,
      minWidth: 250,
      renderCell: (params) => (
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ py: 1, minWidth: 0 }}>
          <Avatar src={params.row.avatar ?? undefined} sx={{ width: 36, height: 36 }}>
            {initialsOf(`${params.row.first_name} ${params.row.last_name}`)}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 700 }} noWrap>
                {params.row.first_name} {params.row.last_name}
              </Typography>
              {params.row.id === currentUser?.id && (
                <Chip size="small" label="You" sx={{ height: 18, fontSize: '0.625rem' }} />
              )}
            </Stack>
            <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
              {params.row.email}
            </Typography>
          </Box>
        </Stack>
      ),
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 150,
      renderCell: (params) => (
        <Chip
          size="small"
          color={ROLE_COLOR[params.row.role]}
          variant={params.row.role === 'editor' ? 'outlined' : 'filled'}
          label={USER_ROLE_OPTIONS.find((option) => option.value === params.row.role)?.label}
        />
      ),
    },
    {
      field: 'last_login',
      headerName: 'Last active',
      width: 150,
      valueGetter: (_value, row) => (row.last_login ? fromNow(row.last_login) : 'Never'),
    },
    {
      field: 'date_joined',
      headerName: 'Joined',
      width: 130,
      valueGetter: (_value, row) => formatDate(row.date_joined),
    },
    {
      field: 'is_active',
      headerName: 'Active',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <Tooltip title={params.row.is_active ? 'Deactivate account' : 'Activate account'}>
          <Switch
            size="small"
            checked={params.row.is_active}
            disabled={params.row.id === currentUser?.id}
            onChange={async (event) => {
              try {
                await update.mutateAsync({
                  id: params.row.id,
                  payload: { is_active: event.target.checked },
                });
                toast.success(event.target.checked ? 'Account activated.' : 'Account deactivated.');
              } catch (err) {
                toast.error(getErrorMessage(err));
              }
            }}
            inputProps={{ 'aria-label': `Toggle account for ${params.row.email}` }}
          />
        </Tooltip>
      ),
    },
    {
      field: 'actions',
      headerName: '',
      width: 96,
      sortable: false,
      align: 'right',
      renderCell: (params) => (
        <Stack direction="row" spacing={0.25}>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              aria-label={`Edit ${params.row.email}`}
              onClick={() => {
                setEditing(params.row);
                setOpen(true);
              }}
            >
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={params.row.id === currentUser?.id ? 'You cannot delete your own account' : 'Delete'}>
            <span>
              <IconButton
                size="small"
                disabled={params.row.id === currentUser?.id}
                aria-label={`Delete ${params.row.email}`}
                onClick={() => setPendingDelete(params.row)}
              >
                <DeleteOutlineIcon fontSize="small" color="error" />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <>
      <Seo title="Users" noIndex />

      <AdminPageHeader
        title="Users"
        description="Accounts with access to the CMS. Editors can manage content; admins can also manage users and settings."
        breadcrumb={[{ label: 'Users' }]}
        actions={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            Invite user
          </Button>
        }
      />

      <Card>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={1.5}
          sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}
        >
          <TextField
            size="small"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(0);
            }}
            placeholder="Search by name or email"
            aria-label="Search users"
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
            label="Role"
            value={role}
            onChange={(event) => setRole(event.target.value)}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="all">All roles</MenuItem>
            {USER_ROLE_OPTIONS.map((option) => (
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
            localeText={{ noRowsLabel: 'No users match these filters.' }}
            sx={{
              border: 'none',
              '& .MuiDataGrid-columnHeaders': { backgroundColor: 'grey.50' },
              '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': { outline: 'none' },
            }}
          />
        )}
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>{editing ? 'Edit user' : 'Invite a user'}</DialogTitle>
        <FormProvider {...methods}>
          <form onSubmit={onSubmit} noValidate>
            <DialogContent dividers>
              {!editing && (
                <Alert severity="info" sx={{ mb: 2.5, borderRadius: 1.5 }}>
                  The user receives an email invitation and sets their own password — no password is entered
                  here.
                </Alert>
              )}
              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <RHFTextField<UserFormValues> name="first_name" label="First name" required />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <RHFTextField<UserFormValues> name="last_name" label="Last name" required />
                </Grid>
                <Grid size={12}>
                  <RHFTextField<UserFormValues> name="email" label="Email address" type="email" required />
                </Grid>
                <Grid size={12}>
                  <RHFSelect<UserFormValues>
                    name="role"
                    label="Role"
                    options={USER_ROLE_OPTIONS}
                    helperText="Editors manage content. Admins additionally manage users and site settings. Super Admins have full access."
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button onClick={() => setOpen(false)} color="inherit">
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={methods.formState.isSubmitting}>
                {editing ? 'Save changes' : 'Send invitation'}
              </Button>
            </DialogActions>
          </form>
        </FormProvider>
      </Dialog>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this user?"
        description={
          <>
            <strong>
              {pendingDelete?.first_name} {pendingDelete?.last_name}
            </strong>{' '}
            will lose access immediately. Content they authored is retained.
          </>
        }
        destructive
        confirmLabel="Delete user"
        loading={remove.isPending}
        onClose={() => setPendingDelete(null)}
        onConfirm={async () => {
          if (!pendingDelete) return;
          try {
            await remove.mutateAsync(pendingDelete.id);
            toast.success('User deleted.');
          } catch (err) {
            toast.error(getErrorMessage(err));
          }
          setPendingDelete(null);
        }}
      />
    </>
  );
}
