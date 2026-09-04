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
import Pagination from '@mui/material/Pagination';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SearchIcon from '@mui/icons-material/Search';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import { getErrorMessage } from '@/api/apiClient';
import { useToast } from '@/app/ToastProvider';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Seo } from '@/components/common/Seo';
import { EmptyState, ErrorState } from '@/components/common/States';
import { useMediaLibrary, useMediaMutations } from '@/hooks/useResources';
import { useCopyToClipboard, useDebounced } from '@/hooks/useUi';
import type { MediaAsset } from '@/types';
import { formatBytes, formatDate } from '@/utils/format';

const PAGE_SIZE = 24;

export default function AdminMediaPage() {
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const [page, setPage] = useState(1);
  const [preview, setPreview] = useState<MediaAsset | null>(null);
  const [pendingDelete, setPendingDelete] = useState<MediaAsset | null>(null);

  const debouncedSearch = useDebounced(search, 350);
  const { copied, copy } = useCopyToClipboard();
  const { upload, remove } = useMediaMutations();

  const query = useMemo(
    () => ({ page, page_size: PAGE_SIZE, search: debouncedSearch || undefined, type }),
    [page, debouncedSearch, type],
  );
  const { data, isPending, isError, error, refetch } = useMediaLibrary(query);

  const assets = data?.results ?? [];
  const pageCount = Math.ceil((data?.count ?? 0) / PAGE_SIZE);

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    try {
      for (const file of Array.from(files)) {
        await upload.mutateAsync(file);
      }
      toast.success(`${files.length} ${files.length === 1 ? 'file' : 'files'} uploaded.`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <>
      <Seo title="Media library" noIndex />

      <AdminPageHeader
        title="Media library"
        description="Every image used across the website. Files are stored by the backend — the frontend only ever references their URLs."
        breadcrumb={[{ label: 'Media' }]}
        actions={
          <Button
            component="label"
            variant="contained"
            startIcon={<UploadFileOutlinedIcon />}
            disabled={upload.isPending}
          >
            {upload.isPending ? 'Uploading…' : 'Upload files'}
            <input
              hidden
              multiple
              type="file"
              accept="image/*"
              onChange={(event) => void handleUpload(event.target.files)}
            />
          </Button>
        }
      />

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 2.5 }}>
        <TextField
          size="small"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Search by file name or description"
          aria-label="Search media"
          sx={{ flex: 1, maxWidth: 460 }}
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
          label="File type"
          value={type}
          onChange={(event) => setType(event.target.value)}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="all">All types</MenuItem>
          <MenuItem value="image">Images</MenuItem>
          <MenuItem value="application">Documents</MenuItem>
          <MenuItem value="video">Video</MenuItem>
        </TextField>
        <Box sx={{ flex: 1 }} />
        <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
          {data?.count ?? 0} files
        </Typography>
      </Stack>

      {isError && <ErrorState error={error} onRetry={() => void refetch()} />}

      {isPending ? (
        <Grid container spacing={2}>
          {Array.from({ length: 12 }).map((_, index) => (
            <Grid key={index} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
              <Skeleton variant="rectangular" height={150} />
            </Grid>
          ))}
        </Grid>
      ) : assets.length === 0 ? (
        <EmptyState
          title="No files found"
          description="Upload images to use across conference pages, speakers and site content."
        />
      ) : (
        <Grid container spacing={2}>
          {assets.map((asset) => (
            <Grid key={asset.id} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
              <Card sx={{ overflow: 'hidden', height: '100%' }}>
                <Box
                  component="button"
                  onClick={() => setPreview(asset)}
                  aria-label={`Open ${asset.file_name}`}
                  sx={{
                    display: 'block',
                    width: '100%',
                    p: 0,
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: 'grey.100',
                  }}
                >
                  <Box
                    component="img"
                    src={asset.thumbnail_url ?? asset.url}
                    alt={asset.alt_text}
                    loading="lazy"
                    sx={{ width: '100%', height: 118, objectFit: 'cover', display: 'block' }}
                  />
                </Box>
                <Box sx={{ p: 1.25 }}>
                  <Typography
                    variant="caption"
                    sx={{ display: 'block', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                  >
                    {asset.file_name}
                  </Typography>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 0.5 }}>
                    <Typography variant="caption" color="text.disabled">
                      {formatBytes(asset.size_bytes)}
                    </Typography>
                    <Stack direction="row">
                      <Tooltip title={copied ? 'Copied' : 'Copy URL'}>
                        <IconButton
                          size="small"
                          aria-label={`Copy URL for ${asset.file_name}`}
                          onClick={() => void copy(asset.url)}
                        >
                          {copied ? (
                            <CheckIcon sx={{ fontSize: 15 }} color="success" />
                          ) : (
                            <ContentCopyIcon sx={{ fontSize: 15 }} />
                          )}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          aria-label={`Delete ${asset.file_name}`}
                          onClick={() => setPendingDelete(asset)}
                        >
                          <DeleteOutlineIcon sx={{ fontSize: 15 }} color="error" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Stack>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {pageCount > 1 && (
        <Stack alignItems="center" sx={{ mt: 4 }}>
          <Pagination count={pageCount} page={page} onChange={(_, value) => setPage(value)} shape="rounded" />
        </Stack>
      )}

      <Dialog open={Boolean(preview)} onClose={() => setPreview(null)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>{preview?.file_name}</DialogTitle>
        <DialogContent dividers>
          {preview && (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 7 }}>
                <Box
                  component="img"
                  src={preview.url}
                  alt={preview.alt_text}
                  sx={{ width: '100%', borderRadius: 1.5, display: 'block' }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 5 }}>
                <Stack spacing={2}>
                  {[
                    ['Description', preview.alt_text],
                    ['Type', preview.mime_type],
                    ['Size', formatBytes(preview.size_bytes)],
                    [
                      'Dimensions',
                      preview.width && preview.height ? `${preview.width} × ${preview.height}` : 'Unknown',
                    ],
                    ['Uploaded', formatDate(preview.uploaded_at, 'DD MMMM YYYY')],
                    ['Uploaded by', preview.uploaded_by ?? '—'],
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
                  <TextField
                    label="URL"
                    value={preview.url}
                    size="small"
                    InputProps={{
                      readOnly: true,
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton size="small" aria-label="Copy URL" onClick={() => void copy(preview.url)}>
                            {copied ? <CheckIcon sx={{ fontSize: 16 }} color="success" /> : <ContentCopyIcon sx={{ fontSize: 16 }} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Stack>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setPreview(null)} color="inherit">
            Close
          </Button>
          <Button
            color="error"
            onClick={() => {
              setPendingDelete(preview);
              setPreview(null);
            }}
          >
            Delete file
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this file?"
        description={
          <>
            <strong>{pendingDelete?.file_name}</strong> will be removed permanently. Any page still
            referencing it will show a broken image.
          </>
        }
        destructive
        confirmLabel="Delete file"
        loading={remove.isPending}
        onClose={() => setPendingDelete(null)}
        onConfirm={async () => {
          if (!pendingDelete) return;
          try {
            await remove.mutateAsync(pendingDelete.id);
            toast.success('File deleted.');
          } catch (err) {
            toast.error(getErrorMessage(err));
          }
          setPendingDelete(null);
        }}
      />
    </>
  );
}
