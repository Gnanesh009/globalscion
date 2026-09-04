import Chip, { type ChipProps } from '@mui/material/Chip';
import type { StatusMeta } from '@/utils/statusMeta';

const TONE_COLOR: Record<StatusMeta['tone'], { bg: string; fg: string }> = {
  default: { bg: 'rgba(90,100,116,0.10)', fg: '#3C424E' },
  success: { bg: 'rgba(5,150,105,0.12)', fg: '#047857' },
  warning: { bg: 'rgba(217,119,6,0.14)', fg: '#B45309' },
  error: { bg: 'rgba(220,38,38,0.12)', fg: '#B91C1C' },
  info: { bg: 'rgba(37,99,235,0.12)', fg: '#1D4ED8' },
  primary: { bg: 'rgba(11,31,58,0.10)', fg: '#0B1F3A' },
};

interface StatusChipProps extends Omit<ChipProps, 'color'> {
  meta: StatusMeta;
}

/** Single visual language for status across the public site and the admin grids. */
export function StatusChip({ meta, size = 'small', sx, ...rest }: StatusChipProps) {
  const colors = TONE_COLOR[meta.tone];
  return (
    <Chip
      size={size}
      label={meta.label}
      sx={[
        {
          backgroundColor: colors.bg,
          color: colors.fg,
          fontWeight: 700,
          border: 'none',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...rest}
    />
  );
}
