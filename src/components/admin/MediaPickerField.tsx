import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import SearchIcon from '@mui/icons-material/Search';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import { getErrorMessage } from '@/api/apiClient';
import { useToast } from '@/app/ToastProvider';
import { EmptyState } from '@/components/common/States';
import { useMediaLibrary, useMediaMutations } from '@/hooks/useResources';
import { useDebounced } from '@/hooks/useUi';

interface MediaPickerFieldProps {
  label: string;
  value: string | null;
  onChange: (url: string | null) => void;
  helperText?: string;
  /** Preview aspect ratio, e.g. '16 / 9'. */
  ratio?: string;
}

/**
 * Image fields never hold binaries — they hold a URL supplied by the media
 * library, which is exactly what the Django API will return in production.
 */
export function MediaPickerField({ label, value, onChange, helperText, ratio = '16 / 9' }: MediaPickerFieldProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(value);
  const debouncedSearch = useDebounced(search, 350);
  const toast = useToast();

  const { data, isPending } = useMediaLibrary({ search: debouncedSearch || undefined, page_size: 24 });
  const { upload } = useMediaMutations();

  const handleUpload = async (file: File | undefined) => {
    if (!file) return;
    try {
      const asset = await upload.mutateAsync(file);
      setSelected(asset.url);
      toast.success('Image uploaded to the media library.');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <Box>
      <Typography variant="subtitle2" component="p" sx={{ mb: 1 }}>
        {label}
      </Typography>

      {value ? (
        <Box
          sx={{
            position: 'relative',
            borderRadius: 1.5,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
            aspectRatio: ratio,
          }}
        >
          <Box
            component="img"
            src={value}
            alt=""
            sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <Stack direction="row" spacing={0.5} sx={{ position: 'absolute', top: 8, right: 8 }}>
            <Button
              size="small"
              variant="contained"
              onClick={() => {
                setSelected(value);
                setOpen(true);
              }}
              sx={{ backgroundColor: 'rgba(255,255,255,0.94)', color: 'text.primary', '&:hover': { backgroundColor: '#fff' } }}
            >
              Replace
            </Button>
            <IconButton
              size="small"
              onClick={() => onChange(null)}
              aria-label={`Remove ${label}`}
              sx={{ backgroundColor: 'rgba(255,255,255,0.94)', '&:hover': { backgroundColor: '#fff' } }}
            >
              <DeleteOutlineIcon fontSize="small" color="error" />
            </IconButton>
          </Stack>
        </Box>
      ) : (
        <Stack
          component="button"
          type="button"
          onClick={() => setOpen(true)}
          alignItems="center"
          justifyContent="center"
          spacing={1}
          sx={{
            width: '100%',
            aspectRatio: ratio,
            cursor: 'pointer',
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 1.5,
            backgroundColor: 'grey.50',
            color: 'text.secondary',
            '&:hover': { borderColor: 'primary.main', backgroundColor: 'rgba(37,99,235,0.03)' },
          }}
        >
          <ImageOutlinedIcon />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Choose from media library
          </Typography>
          <Typography variant="caption" color="text.disabled">
            or upload a new image
          </Typography>
        </Stack>
      )}

      {helperText && (
        <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 0.75 }}>
          {helperText}
        </Typography>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Media library</DialogTitle>
        <DialogContent dividers>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 2.5 }}>
            <TextField
              size="small"
              fullWidth
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by file name or description"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 18 }} />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              component="label"
              variant="outlined"
              startIcon={<UploadFileOutlinedIcon />}
              disabled={upload.isPending}
              sx={{ flexShrink: 0 }}
            >
              {upload.isPending ? 'Uploading…' : 'Upload'}
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(event) => void handleUpload(event.target.files?.[0])}
              />
            </Button>
          </Stack>

          {isPending ? (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 1.5 }}>
              {Array.from({ length: 12 }).map((_, index) => (
                <Skeleton key={index} variant="rectangular" height={110} />
              ))}
            </Box>
          ) : data?.results.length === 0 ? (
            <EmptyState title="No images found" description="Upload an image or adjust your search." compact />
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 1.5 }}>
              {data?.results.map((asset) => {
                const isSelected = selected === asset.url;
                return (
                  <Box
                    key={asset.id}
                    component="button"
                    type="button"
                    onClick={() => setSelected(asset.url)}
                    aria-pressed={isSelected}
                    sx={{
                      position: 'relative',
                      p: 0,
                      cursor: 'pointer',
                      borderRadius: 1.5,
                      overflow: 'hidden',
                      border: '2px solid',
                      borderColor: isSelected ? 'primary.main' : 'transparent',
                      outline: '1px solid',
                      outlineColor: 'divider',
                    }}
                  >
                    <Box
                      component="img"
                      src={asset.thumbnail_url ?? asset.url}
                      alt={asset.alt_text}
                      loading="lazy"
                      sx={{ width: '100%', height: 110, objectFit: 'cover', display: 'block' }}
                    />
                    {isSelected && (
                      <CheckCircleIcon
                        sx={{ position: 'absolute', top: 6, right: 6, color: 'primary.main', fontSize: 20, backgroundColor: '#fff', borderRadius: '50%' }}
                      />
                    )}
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        px: 1,
                        py: 0.75,
                        backgroundColor: 'background.paper',
                        textAlign: 'left',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {asset.file_name}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={!selected}
            onClick={() => {
              onChange(selected);
              setOpen(false);
            }}
          >
            Use this image
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
