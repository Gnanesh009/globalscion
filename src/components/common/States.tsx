import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import RefreshIcon from '@mui/icons-material/Refresh';
import { getErrorMessage } from '@/api/apiClient';

interface StateShellProps {
  icon: ReactNode;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  tone?: 'neutral' | 'danger';
  compact?: boolean;
}

function StateShell({ icon, title, description, action, tone = 'neutral', compact }: StateShellProps) {
  return (
    <Stack
      role={tone === 'danger' ? 'alert' : undefined}
      alignItems="center"
      justifyContent="center"
      spacing={2}
      sx={{
        textAlign: 'center',
        py: compact ? 5 : { xs: 7, md: 10 },
        px: 3,
        border: '1px dashed',
        borderColor: tone === 'danger' ? 'error.light' : 'divider',
        borderRadius: 1,
        backgroundColor: tone === 'danger' ? 'rgba(220,38,38,0.03)' : 'background.paper',
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          backgroundColor: tone === 'danger' ? 'error.light' : 'grey.100',
          color: tone === 'danger' ? 'error.dark' : 'text.secondary',
        }}
      >
        {icon}
      </Box>
      <Box sx={{ maxWidth: 460 }}>
        <Typography variant="h4" component="p" gutterBottom>
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        )}
      </Box>
      {action}
    </Stack>
  );
}

export function EmptyState({
  title = 'Nothing to show yet',
  description = 'Try adjusting your filters or search terms.',
  action,
  compact,
}: {
  title?: string;
  description?: ReactNode;
  action?: ReactNode;
  compact?: boolean;
}) {
  return (
    <StateShell
      icon={<SearchOffIcon />}
      title={title}
      description={description}
      action={action}
      compact={compact}
    />
  );
}

export function ErrorState({
  error,
  onRetry,
  title = 'We couldn’t load this content',
  compact,
}: {
  error?: unknown;
  onRetry?: () => void;
  title?: string;
  compact?: boolean;
}) {
  return (
    <StateShell
      tone="danger"
      icon={<ErrorOutlineIcon />}
      title={title}
      description={error ? getErrorMessage(error) : 'Please check your connection and try again.'}
      compact={compact}
      action={
        onRetry && (
          <Button variant="outlined" color="inherit" startIcon={<RefreshIcon />} onClick={onRetry}>
            Try again
          </Button>
        )
      }
    />
  );
}

export function LoadingScreen({ label = 'Loading' }: { label?: string }) {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      spacing={2}
      sx={{ minHeight: '60vh', width: '100%' }}
      role="status"
      aria-live="polite"
    >
      <CircularProgress size={28} thickness={4} />
      <Typography variant="body2" color="text.secondary">
        {label}…
      </Typography>
    </Stack>
  );
}
