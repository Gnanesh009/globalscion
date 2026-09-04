import { useFormContext } from 'react-hook-form';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { SortableList } from '@/components/admin/SortableList';
import { EmptyState } from '@/components/common/States';
import type { ConferenceFormValues } from '../builderSchema';
import { StringListEditor } from './StringListEditor';

export function StepTopics() {
  const { watch, setValue } = useFormContext<ConferenceFormValues>();
  const themes = watch('key_themes');

  const update = (next: typeof themes) =>
    setValue(
      'key_themes',
      next.map((theme, index) => ({ ...theme, display_order: index + 1 })),
      { shouldDirty: true },
    );

  const addTheme = () =>
    update([
      ...themes,
      { id: `theme-${Date.now()}`, title: '', description: '', display_order: themes.length + 1 },
    ]);

  return (
    <Stack spacing={4}>
      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h4" component="h3">
              Scientific tracks
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Drag to reorder. These appear as the numbered sessions list on the public page.
            </Typography>
          </Box>
          <Button startIcon={<AddIcon />} variant="outlined" onClick={addTheme}>
            Add track
          </Button>
        </Stack>

        {themes.length === 0 ? (
          <EmptyState
            title="No tracks yet"
            description="Add the scientific sessions or topic areas this conference covers."
            action={
              <Button startIcon={<AddIcon />} variant="contained" onClick={addTheme}>
                Add the first track
              </Button>
            }
            compact
          />
        ) : (
          <SortableList
            items={themes}
            getId={(theme) => theme.id}
            onReorder={update}
            renderItem={(theme, index) => (
              <Grid container spacing={1.5} sx={{ p: 1.5 }} alignItems="flex-start">
                <Grid size={{ xs: 12, md: 5 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label={`Track ${index + 1} title`}
                    value={theme.title}
                    onChange={(event) => {
                      const next = [...themes];
                      next[index] = { ...theme, title: event.target.value };
                      update(next);
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6.5 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Description"
                    value={theme.description}
                    onChange={(event) => {
                      const next = [...themes];
                      next[index] = { ...theme, description: event.target.value };
                      update(next);
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 0.5 }} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <IconButton
                    aria-label={`Delete track ${index + 1}`}
                    onClick={() => update(themes.filter((item) => item.id !== theme.id))}
                  >
                    <DeleteOutlineIcon fontSize="small" color="error" />
                  </IconButton>
                </Grid>
              </Grid>
            )}
          />
        )}
      </Box>

      <StringListEditor
        name="who_should_attend"
        title="Who should attend"
        description="One audience group per line — displayed as a checklist."
        placeholder="e.g. Developmental paediatricians"
      />

      <StringListEditor
        name="why_attend"
        title="Why attend"
        description="Benefits of attending, shown as numbered cards."
        placeholder="e.g. Present your work to an international, peer-reviewed audience"
      />
    </Stack>
  );
}
