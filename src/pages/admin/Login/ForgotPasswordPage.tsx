import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { authApi } from '@/api/authApi';
import { getErrorMessage } from '@/api/apiClient';
import { Seo } from '@/components/common/Seo';
import { RHFTextField } from '@/components/forms';
import { ADMIN_PATHS } from '@/constants';
import { AuthShell } from './AuthShell';

const schema = z.object({ email: z.string().email('Enter a valid email address.') });
type ForgotFormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const methods = useForm<ForgotFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  const onSubmit = methods.handleSubmit(async (values) => {
    setError(null);
    try {
      await authApi.forgotPassword(values.email);
      setSent(true);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  });

  return (
    <>
      <Seo title="Reset your password" noIndex />
      <AuthShell
        title="Reset your password"
        subtitle="Enter the email address associated with your CMS account and we will send you a reset link."
        footer={
          <Button component={RouterLink} to={ADMIN_PATHS.login} startIcon={<ArrowBackIcon />} size="small">
            Back to sign in
          </Button>
        }
      >
        {sent ? (
          <Alert severity="success" sx={{ borderRadius: 1.5 }}>
            <Typography sx={{ fontWeight: 700, mb: 0.5 }}>Check your inbox</Typography>
            <Typography variant="body2">
              If an account exists for {methods.getValues('email')}, a reset link is on its way. The link
              expires in 60 minutes.
            </Typography>
          </Alert>
        ) : (
          <FormProvider {...methods}>
            <Box component="form" onSubmit={onSubmit} noValidate>
              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 1.5 }}>
                  {error}
                </Alert>
              )}
              <Stack spacing={2.5}>
                <RHFTextField<ForgotFormValues>
                  name="email"
                  label="Email address"
                  type="email"
                  autoFocus
                  autoComplete="email"
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={methods.formState.isSubmitting}
                >
                  {methods.formState.isSubmitting ? 'Sending…' : 'Send reset link'}
                </Button>
              </Stack>
            </Box>
          </FormProvider>
        )}
      </AuthShell>
    </>
  );
}
