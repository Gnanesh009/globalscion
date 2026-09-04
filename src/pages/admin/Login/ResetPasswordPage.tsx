import { useState } from 'react';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { authApi } from '@/api/authApi';
import { getErrorMessage } from '@/api/apiClient';
import { useToast } from '@/app/ToastProvider';
import { Seo } from '@/components/common/Seo';
import { RHFTextField } from '@/components/forms';
import { ADMIN_PATHS } from '@/constants';
import { AuthShell } from './AuthShell';

const schema = z
  .object({
    password: z
      .string()
      .min(8, 'Use at least 8 characters.')
      .regex(/[A-Z]/, 'Include at least one capital letter.')
      .regex(/[0-9]/, 'Include at least one number.'),
    confirm: z.string(),
  })
  .refine((values) => values.password === values.confirm, {
    message: 'Passwords do not match.',
    path: ['confirm'],
  });

type ResetFormValues = z.infer<typeof schema>;

/** Rough strength signal — deliberately simple, the backend enforces policy. */
function strengthOf(password: string) {
  let score = 0;
  if (password.length >= 8) score += 25;
  if (password.length >= 12) score += 25;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 25;
  if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) score += 25;
  return score;
}

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [error, setError] = useState<string | null>(null);

  const methods = useForm<ResetFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: '', confirm: '' },
  });

  const password = methods.watch('password');
  const strength = strengthOf(password ?? '');

  const onSubmit = methods.handleSubmit(async (values) => {
    setError(null);
    try {
      await authApi.resetPassword({
        token: searchParams.get('token') ?? '',
        uid: searchParams.get('uid') ?? '',
        password: values.password,
      });
      toast.success('Password updated. You can now sign in.');
      navigate(ADMIN_PATHS.login, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    }
  });

  return (
    <>
      <Seo title="Set a new password" noIndex />
      <AuthShell
        title="Set a new password"
        subtitle="Choose a password you do not use anywhere else. You will be signed out of other sessions."
        footer={
          <Typography variant="body2" color="text.secondary">
            Remembered it?{' '}
            <Box component={RouterLink} to={ADMIN_PATHS.login} sx={{ color: 'primary.main', fontWeight: 600 }}>
              Back to sign in
            </Box>
          </Typography>
        }
      >
        <FormProvider {...methods}>
          <Box component="form" onSubmit={onSubmit} noValidate>
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 1.5 }}>
                {error}
              </Alert>
            )}
            <Stack spacing={2.5}>
              <Box>
                <RHFTextField<ResetFormValues>
                  name="password"
                  label="New password"
                  type="password"
                  autoComplete="new-password"
                  autoFocus
                />
                {password && (
                  <Box sx={{ mt: 1.25 }}>
                    <LinearProgress
                      variant="determinate"
                      value={strength}
                      color={strength >= 75 ? 'success' : strength >= 50 ? 'warning' : 'error'}
                      sx={{ height: 5, borderRadius: 3 }}
                      aria-label="Password strength"
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                      {strength >= 75 ? 'Strong password' : strength >= 50 ? 'Reasonable — could be longer' : 'Too weak'}
                    </Typography>
                  </Box>
                )}
              </Box>
              <RHFTextField<ResetFormValues>
                name="confirm"
                label="Confirm new password"
                type="password"
                autoComplete="new-password"
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={methods.formState.isSubmitting}
              >
                {methods.formState.isSubmitting ? 'Updating…' : 'Update password'}
              </Button>
            </Stack>
          </Box>
        </FormProvider>
      </AuthShell>
    </>
  );
}
