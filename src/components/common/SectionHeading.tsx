import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  /** Optional right-hand slot (e.g. a "View all" button) — desktop only alignment. */
  action?: ReactNode;
  inverted?: boolean;
  maxWidth?: number;
  id?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  action,
  inverted = false,
  maxWidth = 720,
  id,
}: SectionHeadingProps) {
  const centered = align === 'center';

  return (
    <Stack
      direction={{ xs: 'column', md: action ? 'row' : 'column' }}
      justifyContent="space-between"
      alignItems={{ xs: centered ? 'center' : 'flex-start', md: action ? 'flex-end' : centered ? 'center' : 'flex-start' }}
      spacing={{ xs: 2.5, md: 4 }}
      sx={{ mb: { xs: 4, md: 6 } }}
    >
      <Box sx={{ maxWidth, textAlign: { xs: centered ? 'center' : 'left', md: centered ? 'center' : 'left' }, mx: centered ? 'auto' : 0 }}>
        {eyebrow && (
          <Typography
            variant="eyebrow"
            component="p"
            sx={{ color: inverted ? 'secondary.light' : 'secondary.main', mb: 1.5 }}
          >
            {eyebrow}
          </Typography>
        )}
        <Typography
          id={id}
          variant="h2"
          component="h2"
          sx={{ color: inverted ? 'common.white' : 'text.primary' }}
        >
          {title}
        </Typography>
        {description && (
          <Typography
            variant="lead"
            component="p"
            sx={{ mt: 2, color: inverted ? 'rgba(255,255,255,0.78)' : 'text.secondary' }}
          >
            {description}
          </Typography>
        )}
      </Box>
      {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
    </Stack>
  );
}
