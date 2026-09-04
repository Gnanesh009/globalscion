import { useFormContext } from 'react-hook-form';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { SortableList } from '@/components/admin/SortableList';
import { SECTION_CATALOGUE } from '@/constants';
import type { ConferenceFormValues } from '../builderSchema';

/**
 * Drives the public page directly: the array edited here is the same
 * `sections` array that ConferenceSectionRenderer consumes.
 */
export function StepSections() {
  const { watch, setValue } = useFormContext<ConferenceFormValues>();
  const sections = watch('sections');

  const update = (next: typeof sections) =>
    setValue(
      'sections',
      next.map((section, index) => ({ ...section, order: index + 1 })),
      { shouldDirty: true },
    );

  const meta = (type: string) => SECTION_CATALOGUE.find((item) => item.type === type);
  const enabledCount = sections.filter((section) => section.enabled).length;

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 3, borderRadius: 1.5 }}>
        Reorder and toggle the sections that make up this conference page. The public page renders exactly
        this list, in this order — no code change is needed to change a page&apos;s composition.
      </Alert>

      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <Chip size="small" color="primary" label={`${enabledCount} of ${sections.length} enabled`} sx={{ fontWeight: 700 }} />
        <Typography variant="caption" color="text.disabled">
          Drag the handle, or focus it and press space then the arrow keys, to reorder.
        </Typography>
      </Stack>

      <SortableList
        items={sections}
        getId={(section) => section.type}
        onReorder={update}
        renderItem={(section, index) => {
          const info = meta(section.type);
          const locked = info?.locked;

          return (
            <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 1.75 }}>
              <Typography
                aria-hidden
                sx={{
                  width: 24,
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: 'text.disabled',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {String(index + 1).padStart(2, '0')}
              </Typography>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem' }}>
                    {info?.label ?? section.type}
                  </Typography>
                  {locked && (
                    <Chip
                      size="small"
                      icon={<LockOutlinedIcon sx={{ fontSize: 13 }} />}
                      label="Always on"
                      sx={{ height: 20, fontSize: '0.6875rem' }}
                    />
                  )}
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  {info?.description ?? 'Custom section'}
                </Typography>
              </Box>

              <Switch
                checked={section.enabled}
                disabled={locked}
                onChange={(event) => {
                  const next = [...sections];
                  next[index] = { ...section, enabled: event.target.checked };
                  update(next);
                }}
                inputProps={{ 'aria-label': `Enable ${info?.label ?? section.type} section` }}
              />
            </Stack>
          );
        }}
      />
    </Box>
  );
}
