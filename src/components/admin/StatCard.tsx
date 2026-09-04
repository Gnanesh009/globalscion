import type { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { formatNumber } from '@/utils/format';

interface StatCardProps {
  label: string;
  value: number;
  icon: ReactNode;
  /** Percentage change against the previous period. */
  delta?: number;
  href?: string;
  tone?: 'primary' | 'success' | 'warning' | 'info' | 'neutral';
}

const TONE: Record<NonNullable<StatCardProps['tone']>, { bg: string; fg: string }> = {
  primary: { bg: 'rgba(37,99,235,0.10)', fg: '#1D4ED8' },
  success: { bg: 'rgba(5,150,105,0.12)', fg: '#047857' },
  warning: { bg: 'rgba(217,119,6,0.14)', fg: '#B45309' },
  info: { bg: 'rgba(14,124,134,0.12)', fg: '#0A5D66' },
  neutral: { bg: 'rgba(90,100,116,0.10)', fg: '#3C424E' },
};

export function StatCard({ label, value, icon, delta, href, tone = 'primary' }: StatCardProps) {
  const colors = TONE[tone];
  const TrendIcon = delta === undefined || delta === 0 ? TrendingFlatIcon : delta > 0 ? TrendingUpIcon : TrendingDownIcon;
  const trendColor = delta === undefined || delta === 0 ? 'text.disabled' : delta > 0 ? 'success.dark' : 'error.dark';

  return (
    <Card
      {...(href ? { component: RouterLink, to: href } : {})}
      sx={{
        p: 2.5,
        height: '100%',
        display: 'block',
        textDecoration: 'none',
        transition: 'box-shadow 200ms, transform 200ms',
        ...(href && {
          '&:hover': { boxShadow: '0 10px 26px rgba(11,31,58,0.10)', transform: 'translateY(-2px)' },
        }),
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
          {label}
        </Typography>
        <Box
          aria-hidden
          sx={{
            width: 34,
            height: 34,
            borderRadius: 1.5,
            display: 'grid',
            placeItems: 'center',
            backgroundColor: colors.bg,
            color: colors.fg,
            '& svg': { fontSize: 18 },
          }}
        >
          {icon}
        </Box>
      </Stack>

      <Typography
        sx={{
          mt: 1.5,
          fontSize: '1.875rem',
          fontWeight: 800,
          letterSpacing: '-0.025em',
          lineHeight: 1.1,
          color: 'text.primary',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {formatNumber(value)}
      </Typography>

      {delta !== undefined && (
        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 1 }}>
          <TrendIcon sx={{ fontSize: 16, color: trendColor }} />
          <Typography variant="caption" sx={{ color: trendColor, fontWeight: 700 }}>
            {delta > 0 ? '+' : ''}
            {delta}%
          </Typography>
          <Typography variant="caption" color="text.disabled">
            vs last month
          </Typography>
        </Stack>
      )}
    </Card>
  );
}
