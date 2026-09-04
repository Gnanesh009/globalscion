import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useAuth } from '@/app/AuthProvider';
import { ADMIN_PATHS } from '@/constants';

/**
 * Rendered once per admin session. Listens for the refresh-token failure raised
 * by the axios interceptor so an expired JWT never dumps the user on a blank page.
 */
export function SessionExpiredDialog() {
  const { sessionExpired, dismissSessionExpiry } = useAuth();
  const navigate = useNavigate();

  return (
    <Dialog open={sessionExpired} maxWidth="xs" fullWidth aria-labelledby="session-expired-title">
      <DialogTitle id="session-expired-title" sx={{ fontWeight: 700 }}>
        Your session has expired
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ fontSize: '0.9375rem' }}>
          For security, you have been signed out after a period of inactivity. Any unsaved changes on this
          page remain in the form until you navigate away.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button
          variant="contained"
          onClick={() => {
            dismissSessionExpiry();
            navigate(`${ADMIN_PATHS.login}?next=${encodeURIComponent(window.location.pathname)}`);
          }}
        >
          Sign in again
        </Button>
      </DialogActions>
    </Dialog>
  );
}
