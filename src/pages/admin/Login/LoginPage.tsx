import { useState } from 'react';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { USE_MOCK, toApiError } from '@/api/apiClient';
import { useAuth } from '@/app/AuthProvider';
import { Seo } from '@/components/common/Seo';
import { RHFTextField } from '@/components/forms';
import { ADMIN_PATHS } from '@/constants';
import { AuthShell } from './AuthShell';

const schema = z.object({
  email: z.string().min(1, 'Enter your email address.').email('Enter a valid email address.'),
  password: z.string().min(1, 'Enter your password.'),
  remember: z.boolean().default(true),
});

type LoginFormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const methods = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', remember: true },
  });

  const onSubmit = methods.handleSubmit(async (values) => {
    setFormError(null);
    try {
      await login(values);
      const next = searchParams.get('next');
      navigate(next && next.startsWith('/admin') ? next : ADMIN_PATHS.dashboard, { replace: true });
    } catch (error) {
      const apiError = toApiError(error);
      setFormError(apiError.message);
      if (apiError.fieldErrors) {
        Object.entries(apiError.fieldErrors).forEach(([field, messages]) => {
          methods.setError(field as keyof LoginFormValues, { message: messages[0] });
        });
      }
    }
  });

  return (
    <>
      <Seo title="Admin sign in" noIndex />
      <AuthShell
        title="Sign in to the CMS"
        subtitle="Manage conferences, speakers, agendas and delegate submissions."
        footer={
          <Typography variant="body2" color="text.secondary">
            Trouble signing in?{' '}
            <Box component={RouterLink} to={ADMIN_PATHS.forgotPassword} sx={{ color: 'primary.main', fontWeight: 600 }}>
              Reset your password
            </Box>
          </Typography>
        }
      >
        {USE_MOCK && (
          <Alert severity="info" sx={{ mb: 3, borderRadius: 1.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>
              Demo credentials
            </Typography>
            <Typography variant="body2">
              <code>admin@globalscion.com</code> (Super Admin), <code>programme@globalscion.com</code> (Admin)
              or <code>editor@globalscion.com</code> (Editor) — password <code>globalscion</code>
            </Typography>
          </Alert>
        )}

        {formError && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 1.5 }} onClose={() => setFormError(null)}>
            {formError}
          </Alert>
        )}

        <FormProvider {...methods}>
          <Box component="form" onSubmit={onSubmit} noValidate>
            <Stack spacing={2.5}>
              <RHFTextField<LoginFormValues>
                name="email"
                label="Email address"
                type="email"
                autoComplete="email"
                autoFocus
              />
              <RHFTextField<LoginFormValues>
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={methods.watch('remember')}
                      onChange={(event) => methods.setValue('remember', event.target.checked)}
                    />
                  }
                  label="Keep me signed in"
                  slotProps={{ typography: { fontSize: '0.875rem' } }}
                />
                <Box
                  component={RouterLink}
                  to={ADMIN_PATHS.forgotPassword}
                  sx={{ fontSize: '0.875rem', color: 'primary.main', fontWeight: 600 }}
                >
                  Forgot password?
                </Box>
              </Stack>

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={methods.formState.isSubmitting}
                fullWidth
              >
                {methods.formState.isSubmitting ? 'Signing in…' : 'Sign in'}
              </Button>
            </Stack>
          </Box>
        </FormProvider>
      </AuthShell>
    </>
  );
}
