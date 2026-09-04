import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid2';
import InputAdornment from '@mui/material/InputAdornment';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import SearchIcon from '@mui/icons-material/Search';
import { SpeakerFormDialog } from '@/pages/admin/Speakers/SpeakerFormDialog';
import { EmptyState } from '@/components/common/States';
import { useSpeakers } from '@/hooks/useResources';
import { useDebounced } from '@/hooks/useUi';
import { initialsOf } from '@/utils/format';
import type { ConferenceFormValues } from '../builderSchema';

export function StepSpeakers() {
  const { watch, setValue } = useFormContext<ConferenceFormValues>();
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const debouncedSearch = useDebounced(search, 350);

  const selected = watch('speaker_ids');
  const { data, isPending } = useSpeakers({
    search: debouncedSearch || undefined,
    status: 'published',
    page_size: 50,
  });

  const toggle = (id: string) =>
    setValue(
      'speaker_ids',
      selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id],
      { shouldDirty: true },
    );

  return (
    <>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 3 }}>
        <TextField
          fullWidth
          size="small"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search speakers by name, institution or country"
          aria-label="Search speakers"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 18 }} />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="outlined"
          startIcon={<PersonAddAltIcon />}
          onClick={() => setDialogOpen(true)}
          sx={{ flexShrink: 0 }}
        >
          New speaker
        </Button>
      </Stack>

      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <Chip
          size="small"
          color="primary"
          label={`${selected.length} selected`}
          sx={{ fontWeight: 700 }}
        />
        {selected.length > 0 && (
          <Button size="small" onClick={() => setValue('speaker_ids', [], { shouldDirty: true })}>
            Clear selection
          </Button>
        )}
      </Stack>

      {isPending ? (
        <Grid container spacing={1.5}>
          {Array.from({ length: 8 }).map((_, index) => (
            <Grid key={index} size={{ xs: 12, md: 6 }}>
              <Skeleton variant="rectangular" height={84} />
            </Grid>
          ))}
        </Grid>
      ) : data?.results.length === 0 ? (
        <EmptyState
          title="No speakers found"
          description="Adjust your search, or create a new speaker record."
          compact
        />
      ) : (
        <Grid container spacing={1.5}>
          {data?.results.map((speaker) => {
            const isSelected = selected.includes(speaker.id);
            return (
              <Grid key={speaker.id} size={{ xs: 12, md: 6 }}>
                <Stack
                  component="label"
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  sx={{
                    p: 1.5,
                    cursor: 'pointer',
                    borderRadius: 1.5,
                    border: '1px solid',
                    borderColor: isSelected ? 'primary.main' : 'divider',
                    backgroundColor: isSelected ? 'rgba(37,99,235,0.04)' : 'background.paper',
                    transition: 'border-color 160ms, background-color 160ms',
                    '&:hover': { borderColor: isSelected ? 'primary.main' : 'text.disabled' },
                  }}
                >
                  <Checkbox
                    checked={isSelected}
                    onChange={() => toggle(speaker.id)}
                    inputProps={{ 'aria-label': `Select ${speaker.name}` }}
                  />
                  <Avatar src={speaker.photo ?? undefined} sx={{ width: 42, height: 42 }}>
                    {initialsOf(speaker.name)}
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.875rem' }} noWrap>
                      {speaker.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                      {speaker.designation}
                    </Typography>
                    <Typography variant="caption" color="text.disabled" noWrap sx={{ display: 'block' }}>
                      {speaker.institution} · {speaker.country}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            );
          })}
        </Grid>
      )}

      <SpeakerFormDialog
        open={dialogOpen}
        speaker={null}
        onClose={() => setDialogOpen(false)}
        onCreated={(speaker) => setValue('speaker_ids', [...selected, speaker.id], { shouldDirty: true })}
      />
    </>
  );
}
