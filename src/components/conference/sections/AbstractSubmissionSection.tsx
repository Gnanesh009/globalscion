import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import { abstractApi } from '@/api/abstractApi';
import { getErrorMessage } from '@/api/apiClient';
import { useToast } from '@/app/ToastProvider';
import { Section } from '@/components/common/Section';
import { SectionHeading } from '@/components/common/SectionHeading';
import { RHFSelect, RHFTextField } from '@/components/forms';
import { COUNTRIES, PRESENTATION_TYPE_OPTIONS } from '@/constants';
import { formatDate } from '@/utils/format';
import type { ConferenceSectionProps } from './types';

const schema = z.object({
  author_name: z.string().min(2, 'Enter the presenting author’s full name.'),
  email: z.string().email('Enter a valid email address.'),
  institution: z.string().min(2, 'Enter your institution or organisation.'),
  country: z.string().min(1, 'Select a country.'),
  presentation_type: z.string().min(1, 'Select a presentation type.'),
  title: z.string().min(10, 'The abstract title must be at least 10 characters.'),
  abstract: z
    .string()
    .min(100, 'Abstracts must be at least 100 characters.')
    .max(3000, 'Abstracts are limited to 3,000 characters.'),
});

type AbstractFormValues = z.infer<typeof schema>;

const GUIDELINES = [
  'Maximum 300 words, structured as background, methods, results and conclusion.',
  'Submitted in English, with no identifying author information in the body.',
  'Double-blind reviewed by at least two committee members against relevance, methodology and clarity.',
  'Outcome communicated within three weeks of submission.',
];

export function AbstractSubmissionSection({ conference }: ConferenceSectionProps) {
  const toast = useToast();
  const [submitted, setSubmitted] = useState(false);

  const methods = useForm<AbstractFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      author_name: '',
      email: '',
      institution: '',
      country: '',
      presentation_type: 'oral',
      title: '',
      abstract: '',
    },
  });

  const onSubmit = methods.handleSubmit(async (values) => {
    try {
      await abstractApi.submit({
        ...values,
        presentation_type: values.presentation_type as 'oral' | 'poster' | 'e-poster' | 'workshop',
        conference: conference.title,
        conference_slug: conference.slug,
      });
      setSubmitted(true);
      methods.reset();
      toast.success('Abstract received. A confirmation email is on its way.');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  });

  return (
    <Section id="abstract-submission">
      <Grid container spacing={{ xs: 5, lg: 8 }}>
        <Grid size={{ xs: 12, lg: 5 }}>
          <SectionHeading
            eyebrow="Call for abstracts"
            title="Submit an abstract"
            description={`Submissions close on ${formatDate(conference.abstract_deadline)}. Accepted abstracts appear in the citable book of abstracts.`}
          />

          <Stack spacing={2}>
            {GUIDELINES.map((guideline) => (
              <Stack key={guideline} direction="row" spacing={1.75} alignItems="flex-start">
                <ArticleOutlinedIcon sx={{ fontSize: 18, color: 'secondary.main', mt: 0.3 }} />
                <Typography variant="body2" color="text.secondary">
                  {guideline}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, lg: 7 }}>
          <Box
            sx={{
              p: { xs: 3, md: 4 },
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              backgroundColor: 'background.paper',
            }}
          >
            {submitted ? (
              <Alert
                severity="success"
                sx={{ borderRadius: 1 }}
                action={
                  <Button color="inherit" size="small" onClick={() => setSubmitted(false)}>
                    Submit another
                  </Button>
                }
              >
                <Typography sx={{ fontWeight: 700, mb: 0.5 }}>Abstract received</Typography>
                <Typography variant="body2">
                  The scientific committee will review your submission and respond within three weeks.
                </Typography>
              </Alert>
            ) : (
              <FormProvider {...methods}>
                <Box component="form" onSubmit={onSubmit} noValidate>
                  <Grid container spacing={2.5}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <RHFTextField<AbstractFormValues>
                        name="author_name"
                        label="Presenting author"
                        required
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <RHFTextField<AbstractFormValues> name="email" label="Email address" type="email" required />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <RHFTextField<AbstractFormValues> name="institution" label="Institution" required />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <RHFSelect<AbstractFormValues>
                        name="country"
                        label="Country"
                        options={COUNTRIES.map((country) => ({ value: country, label: country }))}
                        required
                      />
                    </Grid>
                    <Grid size={12}>
                      <RHFSelect<AbstractFormValues>
                        name="presentation_type"
                        label="Preferred presentation type"
                        options={PRESENTATION_TYPE_OPTIONS}
                      />
                    </Grid>
                    <Grid size={12}>
                      <RHFTextField<AbstractFormValues> name="title" label="Abstract title" required />
                    </Grid>
                    <Grid size={12}>
                      <RHFTextField<AbstractFormValues>
                        name="abstract"
                        label="Abstract body"
                        multiline
                        minRows={6}
                        counterMax={3000}
                        required
                      />
                    </Grid>
                    <Grid size={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={methods.formState.isSubmitting}
                      >
                        {methods.formState.isSubmitting ? 'Submitting…' : 'Submit abstract'}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </FormProvider>
            )}
          </Box>
        </Grid>
      </Grid>
    </Section>
  );
}
