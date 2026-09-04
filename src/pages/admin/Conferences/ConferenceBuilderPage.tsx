import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { getErrorMessage, toApiError } from '@/api/apiClient';
import { useToast } from '@/app/ToastProvider';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Seo } from '@/components/common/Seo';
import { LoadingScreen, ErrorState } from '@/components/common/States';
import { ADMIN_PATHS, PUBLIC_PATHS } from '@/constants';
import { useConferenceById, useConferenceMutations } from '@/hooks/useConferences';
import { useCategories, useSpeakers, useSponsors } from '@/hooks/useResources';
import {
  STEP_FIELDS,
  conferenceBuilderSchema,
  conferenceToForm,
  emptyConference,
  formToPayload,
  type ConferenceFormValues,
} from './builderSchema';
import { StepBasicInformation } from './steps/StepBasicInformation';
import { StepEventDetails } from './steps/StepEventDetails';
import { StepHero } from './steps/StepHero';
import { StepTopics } from './steps/StepTopics';
import { StepSpeakers } from './steps/StepSpeakers';
import { StepAgenda } from './steps/StepAgenda';
import { StepSponsors } from './steps/StepSponsors';
import { StepGallery } from './steps/StepGallery';
import { StepFaq } from './steps/StepFaq';
import { StepSeo } from './steps/StepSeo';
import { StepSections } from './steps/StepSections';
import { StepPublishing } from './steps/StepPublishing';

const STEPS = [
  { label: 'Basic information', hint: 'Title, slug, category and description', Component: StepBasicInformation },
  { label: 'Event details', hint: 'Dates, venue, format and deadlines', Component: StepEventDetails },
  { label: 'Hero', hint: 'Imagery, subtitle and calls to action', Component: StepHero },
  { label: 'Topics', hint: 'Scientific tracks, audience and benefits', Component: StepTopics },
  { label: 'Speakers', hint: 'Select or create speakers', Component: StepSpeakers },
  { label: 'Agenda', hint: 'Day-by-day programme', Component: StepAgenda },
  { label: 'Sponsors', hint: 'Sponsors and partners', Component: StepSponsors },
  { label: 'Gallery', hint: 'Photographs from previous editions', Component: StepGallery },
  { label: 'FAQ', hint: 'Frequently asked questions', Component: StepFaq },
  { label: 'SEO', hint: 'Meta title, description and OG image', Component: StepSeo },
  { label: 'Page sections', hint: 'Enable, disable and reorder', Component: StepSections },
  { label: 'Publishing', hint: 'Checklist, status and preview', Component: StepPublishing },
];

interface ConferenceBuilderPageProps {
  mode: 'create' | 'edit';
}

export default function ConferenceBuilderPage({ mode }: ConferenceBuilderPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [activeStep, setActiveStep] = useState(0);
  const [visited, setVisited] = useState<Set<number>>(new Set([0]));

  const { data: conference, isPending, isError, error, refetch } = useConferenceById(
    mode === 'edit' ? id : undefined,
  );
  const { data: categoryData } = useCategories();
  const { data: speakerData } = useSpeakers({ page_size: 200 });
  const { data: sponsorData } = useSponsors({ page_size: 200 });
  const { create, update } = useConferenceMutations();

  const methods = useForm<ConferenceFormValues>({
    resolver: zodResolver(conferenceBuilderSchema),
    defaultValues: emptyConference(),
    mode: 'onBlur',
  });

  useEffect(() => {
    if (conference) methods.reset(conferenceToForm(conference));
  }, [conference, methods]);

  const persist = async (overrides?: Partial<ConferenceFormValues>) => {
    const values = { ...methods.getValues(), ...overrides };
    const payload = formToPayload(values, {
      categories: (categoryData?.results ?? []).map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
      })),
      speakers: speakerData?.results ?? [],
      sponsors: sponsorData?.results ?? [],
    });

    try {
      if (mode === 'edit' && id) {
        await update.mutateAsync({ id, payload });
        if (overrides?.publish_status) methods.setValue('publish_status', overrides.publish_status);
        toast.success(
          overrides?.publish_status === 'published'
            ? 'Published — the public page is live.'
            : 'Changes saved.',
        );
      } else {
        const created = await create.mutateAsync(payload);
        toast.success(
          overrides?.publish_status === 'published'
            ? 'Conference created and published.'
            : 'Draft created.',
        );
        navigate(ADMIN_PATHS.conferenceEdit(created.id), { replace: true });
      }
      methods.reset({ ...values }, { keepValues: true });
    } catch (err) {
      const apiError = toApiError(err);
      if (apiError.fieldErrors) {
        Object.entries(apiError.fieldErrors).forEach(([field, messages]) => {
          methods.setError(field as keyof ConferenceFormValues, { message: messages[0] });
        });
        setActiveStep(0);
      }
      toast.error(getErrorMessage(err));
    }
  };

  const goToStep = async (target: number) => {
    if (target > activeStep) {
      const valid = await methods.trigger(STEP_FIELDS[activeStep]);
      if (!valid) {
        toast.error('Fix the highlighted fields before continuing.');
        return;
      }
    }
    setActiveStep(target);
    setVisited((prev) => new Set(prev).add(target));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (mode === 'edit' && isPending) return <LoadingScreen label="Loading conference" />;

  if (mode === 'edit' && isError) {
    return (
      <>
        <AdminPageHeader title="Edit conference" breadcrumb={[{ label: 'Conferences', href: ADMIN_PATHS.conferences }]} />
        <ErrorState error={error} onRetry={() => void refetch()} />
      </>
    );
  }

  const CurrentStep = STEPS[activeStep].Component;
  const progress = ((activeStep + 1) / STEPS.length) * 100;
  const saving = create.isPending || update.isPending;
  const slug = methods.watch('slug');
  const publishStatus = methods.watch('publish_status');

  return (
    <>
      <Seo title={mode === 'create' ? 'New conference' : 'Edit conference'} noIndex />

      <AdminPageHeader
        title={mode === 'create' ? 'Create a conference' : methods.watch('title') || 'Edit conference'}
        description="Complete the twelve steps to build the public conference page. Everything here maps directly onto what the page renders."
        breadcrumb={[
          { label: 'Conferences', href: ADMIN_PATHS.conferences },
          { label: mode === 'create' ? 'New' : 'Edit' },
        ]}
        actions={
          <>
            <Button
              variant="outlined"
              startIcon={<VisibilityOutlinedIcon />}
              disabled={!slug || mode === 'create'}
              component="a"
              href={PUBLIC_PATHS.conferenceDetails(slug)}
              target="_blank"
              rel="noopener"
            >
              Preview
            </Button>
            <Button
              variant="outlined"
              startIcon={<SaveOutlinedIcon />}
              disabled={saving}
              onClick={() => void persist({ publish_status: 'draft' })}
            >
              Save draft
            </Button>
            <Button
              variant="contained"
              startIcon={<PublicOutlinedIcon />}
              disabled={saving}
              onClick={methods.handleSubmit(
                () => persist({ publish_status: 'published' }),
                () => toast.error('Some required fields are incomplete — check steps 1 to 3.'),
              )}
            >
              {saving ? 'Saving…' : 'Publish'}
            </Button>
          </>
        }
      />

      <FormProvider {...methods}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, lg: 3 }}>
            <Card sx={{ position: { lg: 'sticky' }, top: { lg: 80 }, p: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                <Typography variant="subtitle2">
                  Step {activeStep + 1} of {STEPS.length}
                </Typography>
                <Chip
                  size="small"
                  label={publishStatus}
                  color={publishStatus === 'published' ? 'success' : 'default'}
                  sx={{ textTransform: 'capitalize', fontSize: '0.6875rem' }}
                />
              </Stack>
              <LinearProgress variant="determinate" value={progress} sx={{ height: 5, borderRadius: 3, mb: 2 }} />

              <Stepper
                nonLinear
                activeStep={activeStep}
                orientation="vertical"
                sx={{
                  '& .MuiStepConnector-line': { minHeight: 12 },
                  '& .MuiStepLabel-label': { fontSize: '0.8125rem' },
                }}
              >
                {STEPS.map((step, index) => (
                  <Step key={step.label} completed={visited.has(index) && index < activeStep}>
                    <StepButton onClick={() => void goToStep(index)} sx={{ textAlign: 'left', py: 0.5 }}>
                      <StepLabel
                        optional={
                          <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.6875rem' }}>
                            {step.hint}
                          </Typography>
                        }
                      >
                        {step.label}
                      </StepLabel>
                    </StepButton>
                  </Step>
                ))}
              </Stepper>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, lg: 9 }}>
            <Paper variant="outlined" sx={{ p: { xs: 2, md: 3.5 }, borderRadius: 2 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h2" component="h2">
                  {STEPS[activeStep].label}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {STEPS[activeStep].hint}
                </Typography>
              </Box>
              <Divider sx={{ mb: 3.5 }} />

              {mode === 'create' && activeStep === 0 && (
                <Alert severity="info" sx={{ mb: 3, borderRadius: 1.5 }}>
                  Saving a draft at any point creates the record — you can return and finish the remaining
                  steps later.
                </Alert>
              )}

              <CurrentStep />

              <Divider sx={{ mt: 4, mb: 2.5 }} />

              <Stack direction="row" justifyContent="space-between" spacing={1.5}>
                <Button
                  startIcon={<ArrowBackIcon />}
                  disabled={activeStep === 0}
                  onClick={() => void goToStep(activeStep - 1)}
                >
                  Back
                </Button>
                <Stack direction="row" spacing={1.5}>
                  <Button variant="text" disabled={saving} onClick={() => void persist()}>
                    Save and continue later
                  </Button>
                  {activeStep < STEPS.length - 1 ? (
                    <Button
                      variant="contained"
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => void goToStep(activeStep + 1)}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      startIcon={<PublicOutlinedIcon />}
                      disabled={saving}
                      onClick={methods.handleSubmit(
                        () => persist({ publish_status: 'published' }),
                        () => toast.error('Some required fields are incomplete.'),
                      )}
                    >
                      Publish conference
                    </Button>
                  )}
                </Stack>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </FormProvider>
    </>
  );
}
