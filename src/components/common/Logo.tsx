import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

interface LogoProps {
  variant?: 'dark' | 'light';
  compact?: boolean;
  showTagline?: boolean;
}

/**
 * Wordmark built from type and a single geometric mark — no raster asset, so it
 * stays crisp at every size and can be recoloured for dark surfaces.
 */
export function Logo({ variant = 'dark', compact = false, showTagline = false }: LogoProps) {
  const isLight = variant === 'light';

  return (
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Box
        aria-hidden
        sx={{
          width: compact ? 32 : 38,
          height: compact ? 32 : 38,
          flexShrink: 0,
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          background: isLight
            ? 'linear-gradient(140deg, #14A2AE 0%, #0E7C86 100%)'
            : 'linear-gradient(140deg, #0B1F3A 0%, #12294B 100%)',
        }}
      >
        <Box
          component="svg"
          viewBox="0 0 24 24"
          sx={{ width: compact ? 17 : 20, height: compact ? 17 : 20 }}
          fill="none"
          stroke={isLight ? '#0B1F3A' : '#14A2AE'}
          strokeWidth={1.8}
          strokeLinecap="round"
        >
          <circle cx="12" cy="12" r="9" stroke={isLight ? 'rgba(11,31,58,0.55)' : 'rgba(20,162,174,0.5)'} />
          <ellipse cx="12" cy="12" rx="4.2" ry="9" />
          <path d="M3 12h18M4.6 7h14.8M4.6 17h14.8" strokeWidth={1.2} />
        </Box>
      </Box>

      <Box sx={{ lineHeight: 1 }}>
        <Typography
          component="span"
          sx={{
            display: 'block',
            fontSize: compact ? '1.125rem' : '1.3125rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: isLight ? 'common.white' : 'primary.main',
          }}
        >
          Global<Box component="span" sx={{ color: isLight ? 'secondary.light' : 'secondary.main' }}>Scion</Box>
        </Typography>
        {showTagline && (
          <Typography
            component="span"
            sx={{
              display: 'block',
              mt: 0.4,
              fontSize: '0.625rem',
              fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: isLight ? 'rgba(255,255,255,0.6)' : 'text.secondary',
            }}
          >
            Conferences
          </Typography>
        )}
      </Box>
    </Stack>
  );
}
