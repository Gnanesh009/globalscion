import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { MediaPickerField } from '@/components/admin/MediaPickerField';
import { SortableList } from '@/components/admin/SortableList';
import { EmptyState } from '@/components/common/States';
import type { ConferenceFormValues } from '../builderSchema';

export function StepGallery() {
  const { watch, setValue } = useFormContext<ConferenceFormValues>();
  const gallery = watch('gallery');
  const [pickerValue, setPickerValue] = useState<string | null>(null);

  const update = (next: typeof gallery) =>
    setValue(
      'gallery',
      next.map((image, index) => ({ ...image, display_order: index + 1 })),
      { shouldDirty: true },
    );

  const addImage = (url: string | null) => {
    if (!url) return;
    update([...gallery, { id: `gal-${Date.now()}`, image: url, caption: '', display_order: gallery.length + 1 }]);
    setPickerValue(null);
  };

  return (
    <Stack spacing={3}>
      <Box sx={{ maxWidth: 420 }}>
        <MediaPickerField
          label="Add an image to the gallery"
          value={pickerValue}
          onChange={addImage}
          helperText="Choose from the media library or upload. The image is appended to the gallery."
        />
      </Box>

      {gallery.length === 0 ? (
        <EmptyState
          title="The gallery is empty"
          description="Add photographs from previous editions. If left empty, the gallery section is hidden automatically."
          compact
        />
      ) : (
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
            <Typography variant="body2" color="text.secondary">
              {gallery.length} {gallery.length === 1 ? 'image' : 'images'} — drag to reorder
            </Typography>
            <Button
              size="small"
              color="error"
              startIcon={<DeleteOutlineIcon />}
              onClick={() => update([])}
            >
              Remove all
            </Button>
          </Stack>

          <SortableList
            items={gallery}
            getId={(image) => image.id}
            onReorder={update}
            renderItem={(image, index) => (
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ p: 1.25 }}>
                <Box
                  component="img"
                  src={image.image}
                  alt=""
                  sx={{ width: 82, height: 56, objectFit: 'cover', borderRadius: 1, flexShrink: 0 }}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Caption"
                  value={image.caption}
                  onChange={(event) => {
                    const next = [...gallery];
                    next[index] = { ...image, caption: event.target.value };
                    update(next);
                  }}
                />
                <IconButton
                  aria-label={`Remove image ${index + 1}`}
                  onClick={() => update(gallery.filter((item) => item.id !== image.id))}
                >
                  <DeleteOutlineIcon fontSize="small" color="error" />
                </IconButton>
              </Stack>
            )}
          />
        </Box>
      )}

      <Typography variant="caption" color="text.disabled">
        <AddPhotoAlternateOutlinedIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
        Images are referenced by URL from the media library — nothing is stored in the frontend bundle.
      </Typography>
    </Stack>
  );
}
