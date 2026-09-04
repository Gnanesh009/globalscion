import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SearchIcon from '@mui/icons-material/Search';
import { getErrorMessage } from '@/api/apiClient';
import { useToast } from '@/app/ToastProvider';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { ConferenceSelector } from '@/components/admin/ConferenceSelector';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Seo } from '@/components/common/Seo';
import { StatusChip } from '@/components/common/StatusChip';
import { ErrorState } from '@/components/common/States';
import {
  ADMIN_PAGE_SIZE,
  REGISTRATION_STATUS_OPTIONS,
  REGISTRATION_TYPE_OPTIONS,
} from '@/constants';
import { useRegistrationMutations, useRegistrations } from '@/hooks/useResources';
import { useDebounced } from '@/hooks/useUi';
import type { Registration, RegistrationStatus } from '@/types';
import { formatCurrency, formatDate } from '@/utils/format';
import { registrationMeta } from '@/utils/statusMeta';

export default function AdminRegistrationsPage() {
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [type, setType] = useState('all');
  const [conference, setConference] = useState('all');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(ADMIN_PAGE_SIZE);
  const [pendingDelete, setPendingDelete] = useState<Registration | null>(null);

  const debouncedSearch = useDebounced(search, 400);
  const { updateStatus, remove } = useRegistrationMutations();

  const query = useMemo(
    () => ({
      page: page + 1,
      page_size: pageSize,
      search: debouncedSearch || undefined,
      status,
      type,
      conference,
    }),
    [page, pageSize, debouncedSearch, status, type, conference],
  );
  const { data, isFetching, isError, error, refetch } = useRegistrations(query);

  const columns: GridColDef<Registration>[] = [
    {
      field: 'full_name',
      headerName: 'Delegate',
      flex: 0.9,
      minWidth: 220,
      renderCell: (params) => (
        <Box sx={{ py: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 700 }} noWrap>
            {params.row.full_name}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
            {params.row.email}
          </Typography>
        </Box>
      ),
    },
    { field: 'phone', headerName: 'Phone', width: 150 },
    {
      field: 'conference',
      headerName: 'Conference',
      flex: 1,
      minWidth: 240,
      renderCell: (params) => (
        <Tooltip title={params.row.conference}>
          <Typography variant="body2" noWrap>
            {params.row.conference}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: 'registration_type',
      headerName: 'Type',
      width: 150,
      valueGetter: (_value, row) =>
        REGISTRATION_TYPE_OPTIONS.find((option) => option.value === row.registration_type)?.label ??
        row.registration_type,
    },
    { field: 'country', headerName: 'Country', width: 150 },
    {
      field: 'amount',
      headerName: 'Fee',
      width: 100,
      valueGetter: (_value, row) => formatCurrency(row.amount, row.currency),
    },
    {
      field: 'created_at',
      headerName: 'Registered',
      width: 120,
      valueGetter: (_value, row) => formatDate(row.created_at),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 152,
      sortable: false,
      renderCell: (params) => (
        <Select
          size="small"
          value={params.row.status}
          onChange={async (event) => {
            try {
              await updateStatus.mutateAsync({
                id: params.row.id,
                status: event.target.value as RegistrationStatus,
              });
              toast.success('Registration status updated.');
            } catch (err) {
              toast.error(getErrorMessage(err));
            }
          }}
          inputProps={{ 'aria-label': `Status for ${params.row.full_name}` }}
          sx={{ fontSize: '0.8125rem', '& .MuiSelect-select': { py: 0.6 } }}
          renderValue={(value) => <StatusChip meta={registrationMeta(value as RegistrationStatus)} />}
        >
          {REGISTRATION_STATUS_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      ),
    },
    {
      field: 'actions',
      headerName: '',
      width: 60,
      sortable: false,
      align: 'right',
      renderCell: (params) => (
        <Tooltip title="Delete">
          <IconButton
            size="small"
            aria-label={`Delete registration for ${params.row.full_name}`}
            onClick={() => setPendingDelete(params.row)}
          >
            <DeleteOutlineIcon fontSize="small" color="error" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <>
      <Seo title="Registrations" noIndex />

      <AdminPageHeader
        title="Registrations"
        description="Every delegate registration across the programme. Change a status inline to confirm, cancel or refund."
        breadcrumb={[{ label: 'Registrations' }]}
      />

      <Card>
        <Grid container spacing={1.5} sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              size="small"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(0);
              }}
              placeholder="Search name, email or phone"
              aria-label="Search registrations"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <ConferenceSelector
              value={conference}
              onChange={(value) => {
                setConference(value);
                setPage(0);
              }}
              allowAll
              useSlug
              minWidth={0}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 2 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Type"
              value={type}
              onChange={(event) => setType(event.target.value)}
            >
              <MenuItem value="all">All types</MenuItem>
              {REGISTRATION_TYPE_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 6, md: 2 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <MenuItem value="all">All statuses</MenuItem>
              {REGISTRATION_STATUS_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        {isError ? (
          <Box sx={{ p: 3 }}>
            <ErrorState error={error} onRetry={() => void refetch()} compact />
          </Box>
        ) : (
          <Box sx={{ width: '100%', overflowX: 'auto' }}>
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
              pageSizeOptions={[10, 25, 50, 100]}
              disableRowSelectionOnClick
              disableColumnMenu
              rowHeight={58}
              autoHeight
              localeText={{ noRowsLabel: 'No registrations match these filters.' }}
              sx={{
                border: 'none',
                minWidth: 980,
                '& .MuiDataGrid-columnHeaders': { backgroundColor: 'grey.50' },
                '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': { outline: 'none' },
              }}
            />
          </Box>
        )}
      </Card>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this registration?"
        description={
          <>
            The registration for <strong>{pendingDelete?.full_name}</strong> will be permanently removed.
            This does not issue a refund.
          </>
        }
        destructive
        confirmLabel="Delete registration"
        loading={remove.isPending}
        onClose={() => setPendingDelete(null)}
        onConfirm={async () => {
          if (!pendingDelete) return;
          try {
            await remove.mutateAsync(pendingDelete.id);
            toast.success('Registration deleted.');
          } catch (err) {
            toast.error(getErrorMessage(err));
          }
          setPendingDelete(null);
        }}
      />
    </>
  );
}
