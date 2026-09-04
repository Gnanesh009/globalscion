import { useMemo, useState } from 'react';
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
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { getErrorMessage } from '@/api/apiClient';
import { useToast } from '@/app/ToastProvider';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { ConferenceSelector } from '@/components/admin/ConferenceSelector';
import { Seo } from '@/components/common/Seo';
import { StatusChip } from '@/components/common/StatusChip';
import { ErrorState } from '@/components/common/States';
import { ABSTRACT_STATUS_OPTIONS, ADMIN_PAGE_SIZE, PRESENTATION_TYPE_OPTIONS } from '@/constants';
import { useAbstractMutations, useAbstracts } from '@/hooks/useResources';
import { useDebounced } from '@/hooks/useUi';
import type { AbstractStatus, AbstractSubmission } from '@/types';
import { formatDate } from '@/utils/format';
import { abstractMeta } from '@/utils/statusMeta';

export default function AdminAbstractsPage() {
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [conference, setConference] = useState('all');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(ADMIN_PAGE_SIZE);
  const [preview, setPreview] = useState<AbstractSubmission | null>(null);

  const debouncedSearch = useDebounced(search, 400);
  const { updateStatus } = useAbstractMutations();

  const query = useMemo(
    () => ({ page: page + 1, page_size: pageSize, search: debouncedSearch || undefined, status, conference }),
    [page, pageSize, debouncedSearch, status, conference],
  );
  const { data, isFetching, isError, error, refetch } = useAbstracts(query);

  const setAbstractStatus = async (id: string, next: AbstractStatus) => {
    try {
      await updateStatus.mutateAsync({ id, status: next });
      toast.success('Abstract status updated.');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const columns: GridColDef<AbstractSubmission>[] = [
    {
      field: 'author_name',
      headerName: 'Author',
      flex: 0.85,
      minWidth: 210,
      renderCell: (params) => (
        <Box sx={{ py: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 700 }} noWrap>
            {params.row.author_name}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
            {params.row.email}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'title',
      headerName: 'Abstract title',
      flex: 1.4,
      minWidth: 300,
      renderCell: (params) => (
        <Tooltip title={params.row.title}>
          <Typography variant="body2" noWrap>
            {params.row.title}
          </Typography>
        </Tooltip>
      ),
    },
    { field: 'institution', headerName: 'Institution', flex: 0.9, minWidth: 200 },
    { field: 'country', headerName: 'Country', width: 140 },
    {
      field: 'presentation_type',
      headerName: 'Type',
      width: 140,
      valueGetter: (_value, row) =>
        PRESENTATION_TYPE_OPTIONS.find((option) => option.value === row.presentation_type)?.label ??
        row.presentation_type,
    },
    {
      field: 'submitted_at',
      headerName: 'Submitted',
      width: 120,
      valueGetter: (_value, row) => formatDate(row.submitted_at),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 168,
      sortable: false,
      renderCell: (params) => (
        <Select
          size="small"
          value={params.row.status}
          onChange={(event) => void setAbstractStatus(params.row.id, event.target.value as AbstractStatus)}
          inputProps={{ 'aria-label': `Status for ${params.row.title}` }}
          sx={{ fontSize: '0.8125rem', '& .MuiSelect-select': { py: 0.6 } }}
          renderValue={(value) => <StatusChip meta={abstractMeta(value as AbstractStatus)} />}
        >
          {ABSTRACT_STATUS_OPTIONS.map((option) => (
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
      width: 92,
      sortable: false,
      align: 'right',
      renderCell: (params) => (
        <Stack direction="row" spacing={0.25}>
          <Tooltip title="View details">
            <IconButton
              size="small"
              aria-label={`View ${params.row.title}`}
              onClick={() => setPreview(params.row)}
            >
              <VisibilityOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {params.row.file_url && (
            <Tooltip title="Download file">
              <IconButton
                size="small"
                component="a"
                href={params.row.file_url}
                target="_blank"
                rel="noopener"
                aria-label={`Download the abstract by ${params.row.author_name}`}
              >
                <DownloadOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      ),
    },
  ];

  return (
    <>
      <Seo title="Abstract submissions" noIndex />

      <AdminPageHeader
        title="Abstract submissions"
        description="Submissions from the public conference pages. Move each abstract through review to acceptance or rejection."
        breadcrumb={[{ label: 'Abstracts' }]}
      />

      <Card>
        <Grid container spacing={1.5} sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <TextField
              fullWidth
              size="small"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(0);
              }}
              placeholder="Search author, title or institution"
              aria-label="Search abstracts"
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
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <MenuItem value="all">All statuses</MenuItem>
              {ABSTRACT_STATUS_OPTIONS.map((option) => (
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
              localeText={{ noRowsLabel: 'No abstracts match these filters.' }}
              sx={{
                border: 'none',
                minWidth: 1080,
                '& .MuiDataGrid-columnHeaders': { backgroundColor: 'grey.50' },
                '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': { outline: 'none' },
              }}
            />
          </Box>
        )}
      </Card>

      <Dialog open={Boolean(preview)} onClose={() => setPreview(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, pr: 6 }}>{preview?.title}</DialogTitle>
        <DialogContent dividers>
          {preview && (
            <Stack spacing={2}>
              {[
                ['Presenting author', preview.author_name],
                ['Email', preview.email],
                ['Institution', preview.institution],
                ['Country', preview.country],
                ['Conference', preview.conference],
                [
                  'Presentation type',
                  PRESENTATION_TYPE_OPTIONS.find((o) => o.value === preview.presentation_type)?.label ?? '',
                ],
                ['Submitted', formatDate(preview.submitted_at, 'DD MMMM YYYY')],
              ].map(([label, value]) => (
                <Box key={label}>
                  <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>
                    {label}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {value}
                  </Typography>
                </Box>
              ))}
              <Box>
                <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mb: 0.5 }}>
                  Status
                </Typography>
                <StatusChip meta={abstractMeta(preview.status)} />
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setPreview(null)} color="inherit">
            Close
          </Button>
          {preview && preview.status !== 'rejected' && (
            <Button
              color="error"
              onClick={async () => {
                await setAbstractStatus(preview.id, 'rejected');
                setPreview(null);
              }}
            >
              Reject
            </Button>
          )}
          {preview && preview.status !== 'accepted' && (
            <Button
              variant="contained"
              onClick={async () => {
                await setAbstractStatus(preview.id, 'accepted');
                setPreview(null);
              }}
            >
              Accept abstract
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
