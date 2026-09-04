import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { useConferences } from '@/hooks/useConferences';

interface ConferenceSelectorProps {
  value: string;
  onChange: (id: string) => void;
  label?: string;
  /** Include an "All conferences" option, used by the delegate data grids. */
  allowAll?: boolean;
  /** Selector returns the slug rather than the id — used for filtering. */
  useSlug?: boolean;
  size?: 'small' | 'medium';
  minWidth?: number;
}

/** Shared conference picker for the standalone agenda, gallery and filter views. */
export function ConferenceSelector({
  value,
  onChange,
  label = 'Conference',
  allowAll = false,
  useSlug = false,
  size = 'small',
  minWidth = 320,
}: ConferenceSelectorProps) {
  const { data, isPending } = useConferences({ publish_status: 'all', page_size: 200 });

  return (
    <TextField
      select
      size={size}
      label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      sx={{ minWidth }}
      disabled={isPending}
    >
      {allowAll && <MenuItem value="all">All conferences</MenuItem>}
      {(data?.results ?? []).map((conference) => (
        <MenuItem key={conference.id} value={useSlug ? conference.slug : conference.id}>
          {conference.title}
        </MenuItem>
      ))}
    </TextField>
  );
}
