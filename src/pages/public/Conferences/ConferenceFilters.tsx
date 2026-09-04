import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid2';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { CONFERENCE_KIND_OPTIONS, EVENT_FORMAT_OPTIONS } from '@/constants';
import type { Category } from '@/types';

export interface ConferenceFilterState {
  search: string;
  category: string;
  kind: string;
  format: string;
  dateFrom: string;
  dateTo: string;
}

interface ConferenceFiltersProps {
  value: ConferenceFilterState;
  categories: Category[];
  onChange: (patch: Partial<ConferenceFilterState>) => void;
  onReset: () => void;
  resultCount?: number;
}

export function ConferenceFilters({
  value,
  categories,
  onChange,
  onReset,
  resultCount,
}: ConferenceFiltersProps) {
  const activeFilters = [
    value.category !== 'all' && {
      key: 'category',
      label: categories.find((c) => c.slug === value.category)?.name ?? value.category,
    },
    value.kind !== 'all' && {
      key: 'kind',
      label: CONFERENCE_KIND_OPTIONS.find((o) => o.value === value.kind)?.label ?? value.kind,
    },
    value.format !== 'all' && {
      key: 'format',
      label: EVENT_FORMAT_OPTIONS.find((o) => o.value === value.format)?.label ?? value.format,
    },
    value.dateFrom && { key: 'dateFrom', label: `From ${dayjs(value.dateFrom).format('DD MMM YYYY')}` },
    value.dateTo && { key: 'dateTo', label: `To ${dayjs(value.dateTo).format('DD MMM YYYY')}` },
  ].filter(Boolean) as { key: keyof ConferenceFilterState; label: string }[];

  return (
    <Box
      component="search"
      sx={{
        p: { xs: 2.5, md: 3 },
        borderRadius: 1,
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 4 }}>
          <TextField
            fullWidth
            value={value.search}
            onChange={(event) => onChange({ search: event.target.value })}
            placeholder="Search by title, topic or city"
            aria-label="Search conferences"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 19, color: 'text.disabled' }} />
                </InputAdornment>
              ),
              endAdornment: value.search ? (
                <InputAdornment position="end">
                  <Button size="small" onClick={() => onChange({ search: '' })} aria-label="Clear search">
                    <ClearIcon sx={{ fontSize: 17 }} />
                  </Button>
                </InputAdornment>
              ) : null,
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 2.5 }}>
          <TextField
            select
            fullWidth
            label="Category"
            value={value.category}
            onChange={(event) => onChange({ category: event.target.value })}
          >
            <MenuItem value="all">All categories</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.slug}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
          <TextField
            select
            fullWidth
            label="Format"
            value={value.format}
            onChange={(event) => onChange({ format: event.target.value })}
          >
            <MenuItem value="all">Any format</MenuItem>
            {EVENT_FORMAT_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 1.75 }}>
          <DatePicker
            label="From"
            value={value.dateFrom ? dayjs(value.dateFrom) : null}
            onChange={(date) => onChange({ dateFrom: date ? date.format('YYYY-MM-DD') : '' })}
            slotProps={{ textField: { fullWidth: true }, field: { clearable: true } }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 1.75 }}>
          <DatePicker
            label="To"
            value={value.dateTo ? dayjs(value.dateTo) : null}
            minDate={value.dateFrom ? dayjs(value.dateFrom) : undefined}
            onChange={(date) => onChange({ dateTo: date ? date.format('YYYY-MM-DD') : '' })}
            slotProps={{ textField: { fullWidth: true }, field: { clearable: true } }}
          />
        </Grid>
      </Grid>

      {(activeFilters.length > 0 || resultCount !== undefined) && (
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          flexWrap="wrap"
          useFlexGap
          sx={{ mt: 2.5, pt: 2.5, borderTop: '1px solid', borderColor: 'divider' }}
        >
          {resultCount !== undefined && (
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
              <strong>{resultCount}</strong> {resultCount === 1 ? 'conference' : 'conferences'} found
            </Typography>
          )}
          {activeFilters.map((filter) => (
            <Chip
              key={filter.key}
              label={filter.label}
              size="small"
              onDelete={() =>
                onChange({
                  [filter.key]: filter.key === 'dateFrom' || filter.key === 'dateTo' ? '' : 'all',
                } as Partial<ConferenceFilterState>)
              }
            />
          ))}
          {activeFilters.length > 0 && (
            <Button size="small" onClick={onReset} sx={{ ml: 'auto' }}>
              Clear all
            </Button>
          )}
        </Stack>
      )}
    </Box>
  );
}
