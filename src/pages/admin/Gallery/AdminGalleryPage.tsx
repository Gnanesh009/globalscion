import { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { conferenceApi } from '@/api/conferenceApi';
import { getErrorMessage } from '@/api/apiClient';
import { useToast } from '@/app/ToastProvider';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { ConferenceSelector } from '@/components/admin/ConferenceSelector';
import { MediaPickerField } from '@/components/admin/MediaPickerField';
import { SortableList } from '@/components/admin/SortableList';
import { Seo } from '@/components/common/Seo';
import { EmptyState, LoadingScreen } from '@/components/common/States';
import { useConferenceById, useConferences } from '@/hooks/useConferences';
import { queryKeys } from '@/hooks/queryKeys';
import { useQueryClient } from '@tanstack/react-query';
import type { GalleryImage } from '@/types';

export default function AdminGalleryPage() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [conferenceId, setConferenceId] = useState('');
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [picker, setPicker] = useState<string | null>(null);

  const { data: list } = useConferences({ publish_status: 'all', page_size: 200 });
  const { data: conference, isPending } = useConferenceById(conferenceId || undefined);

  useEffect(() => {
    if (!conferenceId && list?.results.length) setConferenceId(list.results[0].id);
  }, [list, conferenceId]);

  useEffect(() => {
    if (conference) {
      setGallery(conference.gallery);
      setDirty(false);
    }
  }, [conference]);

  const update = (next: GalleryImage[]) => {
    setGallery(next.map((image, index) => ({ ...image, display_order: index + 1 })));
    setDirty(true);
  };

  const save = async () => {
    if (!conferenceId) return;
    setSaving(true);
    try {
      await conferenceApi.saveGallery(conferenceId, gallery);
      await queryClient.invalidateQueries({ queryKey: queryKeys.conferences.all });
      setDirty(false);
      toast.success('Gallery saved.');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Seo title="Gallery" noIndex />

      <AdminPageHeader
        title="Gallery"
        description="Manage the photographs shown on a conference page. Images are referenced by URL from the media library."
        breadcrumb={[{ label: 'Gallery' }]}
        actions={
          <Button
            variant="contained"
            startIcon={<SaveOutlinedIcon />}
            disabled={!dirty || saving}
            onClick={() => void save()}
          >
            {saving ? 'Saving…' : 'Save gallery'}
          </Button>
        }
      />

      <Card sx={{ p: { xs: 2, md: 3 } }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
          <ConferenceSelector value={conferenceId} onChange={setConferenceId} />
          {dirty && (
            <Alert severity="warning" sx={{ py: 0, borderRadius: 1.5 }}>
              You have unsaved changes.
            </Alert>
          )}
        </Stack>

        {isPending && conferenceId ? (
          <LoadingScreen label="Loading gallery" />
        ) : (
          <Stack spacing={3}>
            <Box sx={{ maxWidth: 400 }}>
              <MediaPickerField
                label="Add an image"
                value={picker}
                onChange={(url) => {
                  if (!url) return;
                  update([
                    ...gallery,
                    { id: `gal-${Date.now()}`, image: url, caption: '', display_order: gallery.length + 1 },
                  ]);
                  setPicker(null);
                }}
              />
            </Box>

            {gallery.length === 0 ? (
              <EmptyState
                title="No images in this gallery"
                description="Add images from the media library. An empty gallery hides the section on the public page."
                compact
              />
            ) : (
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                  {gallery.length} {gallery.length === 1 ? 'image' : 'images'} — drag to reorder
                </Typography>
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
                        sx={{ width: 90, height: 60, objectFit: 'cover', borderRadius: 1, flexShrink: 0 }}
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
          </Stack>
        )}
      </Card>
    </>
  );
}
