import { useFormContext } from 'react-hook-form';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { SortableList } from '@/components/admin/SortableList';
import type { ConferenceFormValues } from '../builderSchema';

interface StringListEditorProps {
  name: 'who_should_attend' | 'why_attend';
  title: string;
  description: string;
  placeholder: string;
}

/** Reorderable list of plain strings — used for audience and benefit lists. */
export function StringListEditor({ name, title, description, placeholder }: StringListEditorProps) {
  const { watch, setValue } = useFormContext<ConferenceFormValues>();
  const items = watch(name);

  // Values are plain strings, so index-based ids keep dnd-kit stable enough for
  // a list that is only ever edited in place.
  const rows = items.map((value, index) => ({ id: `${name}-${index}`, value, index }));

  const update = (next: string[]) => setValue(name, next, { shouldDirty: true });

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h4" component="h3">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Box>
        <Button startIcon={<AddIcon />} variant="outlined" onClick={() => update([...items, ''])}>
          Add item
        </Button>
      </Stack>

      {items.length === 0 ? (
        <Typography variant="body2" color="text.disabled" sx={{ py: 2 }}>
          No items yet — the corresponding section will be hidden on the public page.
        </Typography>
      ) : (
        <SortableList
          items={rows}
          getId={(row) => row.id}
          onReorder={(next) => update(next.map((row) => row.value))}
          renderItem={(row) => (
            <Stack direction="row" spacing={1} alignItems="center" sx={{ p: 1 }}>
              <TextField
                fullWidth
                size="small"
                value={row.value}
                placeholder={placeholder}
                onChange={(event) => {
                  const next = [...items];
                  next[row.index] = event.target.value;
                  update(next);
                }}
                inputProps={{ 'aria-label': `${title} item ${row.index + 1}` }}
              />
              <IconButton
                aria-label={`Delete item ${row.index + 1}`}
                onClick={() => update(items.filter((_, index) => index !== row.index))}
              >
                <DeleteOutlineIcon fontSize="small" color="error" />
              </IconButton>
            </Stack>
          )}
        />
      )}
    </Box>
  );
}
