import { useMemo, useState } from 'react';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PublicOffOutlinedIcon from '@mui/icons-material/PublicOffOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { getErrorMessage } from '@/api/apiClient';
import { useToast } from '@/app/ToastProvider';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Seo } from '@/components/common/Seo';
import { StatusChip } from '@/components/common/StatusChip';
import { ErrorState } from '@/components/common/States';
import { ADMIN_PAGE_SIZE, ADMIN_PATHS, CONFERENCE_STATUS_OPTIONS, PUBLIC_PATHS, PUBLISH_STATUS_OPTIONS } from '@/constants';
import { useConferenceMutations, useConferences } from '@/hooks/useConferences';
import { useCategories } from '@/hooks/useResources';
import { useDebounced } from '@/hooks/useUi';
import type { ConferenceListItem, ConferenceQuery, PublishStatus } from '@/types';
import { formatDateRange, fromNow } from '@/utils/format';
import { conferenceMeta, publishMeta } from '@/utils/statusMeta';

export default function AdminConferencesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [eventStatus, setEventStatus] = useState('all');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(ADMIN_PAGE_SIZE);
  const [menuRow, setMenuRow] = useState<{ anchor: HTMLElement; row: ConferenceListItem } | null>(null);
  const [pendingDelete, setPendingDelete] = useState<ConferenceListItem | null>(null);

  const publishStatus = searchParams.get('status') ?? 'all';
  const debouncedSearch = useDebounced(search, 400);
  const { data: categoryData } = useCategories();
  const { remove, duplicate, setStatus, setFeatured } = useConferenceMutations();

  const query = useMemo<ConferenceQuery>(
    () => ({
      page: page + 1,
      page_size: pageSize,
      search: debouncedSearch || undefined,
      category,
      status: eventStatus as ConferenceQuery['status'],
      publish_status: publishStatus as ConferenceQuery['publish_status'],
    }),
    [page, pageSize, debouncedSearch, category, eventStatus, publishStatus],
  );

  const { data, isFetching, isError, error, refetch } = useConferences(query);

  const closeMenu = () => setMenuRow(null);

  const runAction = async (label: string, action: Promise<unknown>) => {
    try {
      await action;
      toast.success(label);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const columns: GridColDef<ConferenceListItem>[] = [
    {
      field: 'title',
      headerName: 'Conference',
      flex: 1,
      minWidth: 300,
      renderCell: (params: GridRenderCellParams<ConferenceListItem>) => (
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ py: 1, minWidth: 0 }}>
          <Box
            component="img"
            src={params.row.card_image ?? ''}
            alt=""
            sx={{ width: 46, height: 34, objectFit: 'cover', borderRadius: 1, flexShrink: 0, bgcolor: 'grey.100' }}
          />
          <Box sx={{ minWidth: 0 }}>
            <Typography
              component={RouterLink}
              to={ADMIN_PATHS.conferenceEdit(params.row.id)}
              sx={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 700,
                color: 'text.primary',
                textDecoration: 'none',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                '&:hover': { color: 'primary.main' },
              }}
            >
              {params.row.title}
            </Typography>
            <Typography variant="caption" color="text.disabled">
              /{params.row.slug}
            </Typography>
          </Box>
        </Stack>
      ),
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 168,
      valueGetter: (_value, row) => row.category.name,
    },
    {
      field: 'start_date',
      headerName: 'Date',
      width: 190,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2">
            {formatDateRange(params.row.start_date, params.row.end_date)}
          </Typography>
          <StatusChip meta={conferenceMeta(params.row.status)} sx={{ mt: 0.25, height: 19, fontSize: '0.6875rem' }} />
        </Box>
      ),
    },
    {
      field: 'publish_status',
      headerName: 'Status',
      width: 122,
      renderCell: (params) => <StatusChip meta={publishMeta(params.row.publish_status)} />,
    },
    {
      field: 'is_featured',
      headerName: 'Featured',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <Tooltip title={params.row.is_featured ? 'Remove from featured' : 'Mark as featured'}>
          <Switch
            size="small"
            checked={params.row.is_featured}
            onChange={(event) =>
              void runAction(
                event.target.checked ? 'Marked as featured.' : 'Removed from featured.',
                setFeatured.mutateAsync({ id: params.row.id, featured: event.target.checked }),
              )
            }
            inputProps={{ 'aria-label': `Feature ${params.row.title}` }}
          />
        </Tooltip>
      ),
    },
    {
      field: 'updated_at',
      headerName: 'Updated',
      width: 130,
      valueGetter: (_value, row) => fromNow(row.updated_at),
    },
    {
      field: 'actions',
      headerName: '',
      width: 96,
      sortable: false,
      filterable: false,
      align: 'right',
      renderCell: (params) => (
        <Stack direction="row" spacing={0.25}>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => navigate(ADMIN_PATHS.conferenceEdit(params.row.id))}
              aria-label={`Edit ${params.row.title}`}
            >
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <IconButton
            size="small"
            onClick={(event) => setMenuRow({ anchor: event.currentTarget, row: params.row })}
            aria-label={`More actions for ${params.row.title}`}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <>
      <Seo title="Conferences" noIndex />

      <AdminPageHeader
        title="Conferences"
        description="Every conference in the system. Publishing a conference makes its public page live immediately at /conferences/{slug}."
        breadcrumb={[{ label: 'Conferences' }]}
        actions={
          <Button
            component={RouterLink}
            to={ADMIN_PATHS.conferenceNew}
            variant="contained"
            startIcon={<AddIcon />}
          >
            New conference
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
            placeholder="Search conferences"
            aria-label="Search conferences"
            sx={{ flex: 1, minWidth: 200 }}
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
            label="Publish status"
            value={publishStatus}
            onChange={(event) => {
              const value = event.target.value;
              setSearchParams(value === 'all' ? {} : { status: value }, { replace: true });
              setPage(0);
            }}
            sx={{ minWidth: 160 }}
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
            label="Event status"
            value={eventStatus}
            onChange={(event) => {
              setEventStatus(event.target.value);
              setPage(0);
            }}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="all">All events</MenuItem>
            {CONFERENCE_STATUS_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            size="small"
            label="Category"
            value={category}
            onChange={(event) => {
              setCategory(event.target.value);
              setPage(0);
            }}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="all">All categories</MenuItem>
            {(categoryData?.results ?? []).map((item) => (
              <MenuItem key={item.id} value={item.slug}>
                {item.name}
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
            rowHeight={62}
            autoHeight
            localeText={{ noRowsLabel: 'No conferences match these filters.' }}
            sx={{
              border: 'none',
              '& .MuiDataGrid-columnHeaders': { backgroundColor: 'grey.50' },
              '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 700, fontSize: '0.8125rem' },
              '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': { outline: 'none' },
            }}
          />
        )}
      </Card>

      <Menu anchorEl={menuRow?.anchor} open={Boolean(menuRow)} onClose={closeMenu}>
        <MenuItem
          component="a"
          href={PUBLIC_PATHS.conferenceDetails(menuRow?.row.slug ?? '')}
          target="_blank"
          rel="noopener"
          onClick={closeMenu}
        >
          <ListItemIcon>
            <VisibilityOutlinedIcon fontSize="small" />
          </ListItemIcon>
          View public page
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (menuRow) navigate(ADMIN_PATHS.conferenceEdit(menuRow.row.id));
            closeMenu();
          }}
        >
          <ListItemIcon>
            <EditOutlinedIcon fontSize="small" />
          </ListItemIcon>
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (menuRow) void runAction('Conference duplicated as a draft.', duplicate.mutateAsync(menuRow.row.id));
            closeMenu();
          }}
        >
          <ListItemIcon>
            <ContentCopyIcon fontSize="small" />
          </ListItemIcon>
          Duplicate
        </MenuItem>

        {menuRow?.row.publish_status !== 'published' && (
          <MenuItem
            onClick={() => {
              if (menuRow)
                void runAction(
                  'Conference published — the public page is live.',
                  setStatus.mutateAsync({ id: menuRow.row.id, status: 'published' as PublishStatus }),
                );
              closeMenu();
            }}
          >
            <ListItemIcon>
              <PublicOutlinedIcon fontSize="small" />
            </ListItemIcon>
            Publish
          </MenuItem>
        )}

        {menuRow?.row.publish_status === 'published' && (
          <MenuItem
            onClick={() => {
              if (menuRow)
                void runAction(
                  'Conference unpublished.',
                  setStatus.mutateAsync({ id: menuRow.row.id, status: 'draft' as PublishStatus }),
                );
              closeMenu();
            }}
          >
            <ListItemIcon>
              <PublicOffOutlinedIcon fontSize="small" />
            </ListItemIcon>
            Unpublish
          </MenuItem>
        )}

        <MenuItem
          onClick={() => {
            if (menuRow)
              void runAction(
                'Conference archived.',
                setStatus.mutateAsync({ id: menuRow.row.id, status: 'archived' as PublishStatus }),
              );
            closeMenu();
          }}
        >
          <ListItemIcon>
            <ArchiveOutlinedIcon fontSize="small" />
          </ListItemIcon>
          Archive
        </MenuItem>

        <MenuItem
          onClick={() => {
            setPendingDelete(menuRow?.row ?? null);
            closeMenu();
          }}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <DeleteOutlineIcon fontSize="small" color="error" />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this conference?"
        description={
          <>
            <strong>{pendingDelete?.title}</strong> and all of its sections, agenda and gallery will be
            permanently removed. Registrations and abstracts already submitted are retained.
          </>
        }
        confirmLabel="Delete permanently"
        destructive
        loading={remove.isPending}
        onClose={() => setPendingDelete(null)}
        onConfirm={async () => {
          if (!pendingDelete) return;
          await runAction('Conference deleted.', remove.mutateAsync(pendingDelete.id));
          setPendingDelete(null);
        }}
      />
    </>
  );
}
