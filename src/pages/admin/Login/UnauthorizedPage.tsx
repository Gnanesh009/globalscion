import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAuth } from '@/app/AuthProvider';
import { Seo } from '@/components/common/Seo';
import { ADMIN_PATHS, USER_ROLE_OPTIONS } from '@/constants';

export default function UnauthorizedPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const roleLabel = USER_ROLE_OPTIONS.find((option) => option.value === user?.role)?.label;

  return (
    <>
      <Seo title="Access denied" noIndex />
      <Container maxWidth="sm" sx={{ py: { xs: 10, md: 16 }, textAlign: 'center' }}>
        <Box
          aria-hidden
          sx={{
            width: 68,
            height: 68,
            mx: 'auto',
            mb: 3,
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            backgroundColor: 'error.light',
            color: 'error.dark',
          }}
        >
          <LockOutlinedIcon sx={{ fontSize: 30 }} />
        </Box>

        <Typography variant="overline" color="error.main">
          403 — Forbidden
        </Typography>
        <Typography variant="h1" component="h1" sx={{ mt: 1 }}>
          You don’t have access to this area
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          {roleLabel
            ? `Your account is signed in as ${roleLabel}, which does not include permission for this section. Ask a Super Admin to adjust your role.`
            : 'This section requires elevated permissions.'}
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="center" sx={{ mt: 4 }}>
          <Button component={RouterLink} to={ADMIN_PATHS.dashboard} variant="contained">
            Back to dashboard
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => {
              logout();
              navigate(ADMIN_PATHS.login, { replace: true });
            }}
          >
            Sign in as another user
          </Button>
        </Stack>
      </Container>
    </>
  );
}
