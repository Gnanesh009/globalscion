import { useMemo, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { getErrorMessage } from '@/api/apiClient';
import { useToast } from '@/app/ToastProvider';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Seo } from '@/components/common/Seo';
import { StatusChip } from '@/components/common/StatusChip';
import { ErrorState } from '@/components/common/States';
import { ADMIN_PAGE_SIZE, COUNTRIES, PUBLISH_STATUS_OPTIONS } from '@/constants';
import { useSpeakerMutations, useSpeakers } from '@/hooks/useResources';
import { useDebounced } from '@/hooks/useUi';
import type { Speaker } from '@/types';
import { initialsOf } from '@/utils/format';
import { publishMeta } from '@/utils/statusMeta';
import { SpeakerFormDialog } from './SpeakerFormDialog';

export default function AdminSpeakersPage() {
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [country, setCountry] = useState('all');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(ADMIN_PAGE_SIZE);
  const [editing, setEditing] = useState<Speaker | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Speaker | null>(null);

  const debouncedSearch = useDebounced(search, 400);
  const { remove } = useSpeakerMutations();

  const query = useMemo(
    () => ({ page: page + 1, page_size: pageSize, search: debouncedSearch || undefined, status, country }),
    [page, pageSize, debouncedSearch, status, country],
  );
  const { data, isFetching, isError, error, refetch } = useSpeakers(query);

  const columns: GridColDef<Speaker>[] = [
    {
      field: 'name',
      headerName: 'Speaker',
      flex: 1,
      minWidth: 260,
      renderCell: (params) => (
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ py: 1, minWidth: 0 }}>
          <Avatar src={params.row.photo ?? undefined} sx={{ width: 36, height: 36 }}>
            {initialsOf(params.row.name)}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 700 }} noWrap>
                {params.row.name}
              </Typography>
              {params.row.is_keynote && (
                <Chip size="small" label="Keynote" sx={{ height: 18, fontSize: '0.625rem' }} />
              )}
            </Stack>
            <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
              {params.row.designation}
            </Typography>
          </Box>
        </Stack>
      ),
    },
    { field: 'institution', headerName: 'Institution', flex: 0.8, minWidth: 200 },
    { field: 'country', headerName: 'Country', width: 160 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => <StatusChip meta={publishMeta(params.row.status)} />,
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
              aria-label={`Edit ${params.row.name}`}
              onClick={() => {
                setEditing(params.row);
                setDialogOpen(true);
              }}
            >
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              aria-label={`Delete ${params.row.name}`}
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
      <Seo title="Speakers" noIndex />

      <AdminPageHeader
        title="Speakers"
        description="The shared speaker directory. A speaker record is created once and reused across every conference they present at."
        breadcrumb={[{ label: 'Speakers' }]}
        actions={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditing(null);
              setDialogOpen(true);
            }}
          >
            New speaker
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
            placeholder="Search by name, institution or designation"
            aria-label="Search speakers"
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
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="all">All statuses</MenuItem>
            {PUBLISH_STATUS_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            size="small"
            label="Country"
            value={country}
            onChange={(event) => setCountry(event.target.value)}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="all">All countries</MenuItem>
            {COUNTRIES.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
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
            localeText={{ noRowsLabel: 'No speakers match these filters.' }}
            sx={{
              border: 'none',
              '& .MuiDataGrid-columnHeaders': { backgroundColor: 'grey.50' },
              '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': { outline: 'none' },
            }}
          />
        )}
      </Card>

      <SpeakerFormDialog
        open={dialogOpen}
        speaker={editing}
        onClose={() => {
          setDialogOpen(false);
          setEditing(null);
        }}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this speaker?"
        description={
          <>
            <strong>{pendingDelete?.name}</strong> will be removed from the directory and from any conference
            they are attached to.
          </>
        }
        destructive
        confirmLabel="Delete speaker"
        loading={remove.isPending}
        onClose={() => setPendingDelete(null)}
        onConfirm={async () => {
          if (!pendingDelete) return;
          try {
            await remove.mutateAsync(pendingDelete.id);
            toast.success('Speaker deleted.');
          } catch (err) {
            toast.error(getErrorMessage(err));
          }
          setPendingDelete(null);
        }}
      />
    </>
  );
}
