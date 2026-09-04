import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneInTalkOutlinedIcon from '@mui/icons-material/PhoneInTalkOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import { HERO_IMAGES, img } from '@/api/mock/images';
import { getErrorMessage } from '@/api/apiClient';
import { pageApi } from '@/api/pageApi';
import { useToast } from '@/app/ToastProvider';
import { PageHero } from '@/components/common/PageHero';
import { Section } from '@/components/common/Section';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Seo } from '@/components/common/Seo';
import { RHFSelect, RHFTextField } from '@/components/forms';
import { PUBLIC_PATHS } from '@/constants';
import { useConferenceMenu } from '@/hooks/useConferences';
import { useSettings } from '@/hooks/useResources';

const schema = z.object({
  full_name: z.string().min(2, 'Enter your full name.'),
  email: z.string().email('Enter a valid email address.'),
  phone: z.string().optional().default(''),
  subject: z.string().min(1, 'Select an enquiry type.'),
  conference: z.string().optional().default(''),
  message: z.string().min(20, 'Please give us at least a sentence or two (20 characters).'),
});

type ContactFormValues = z.infer<typeof schema>;

const SUBJECTS = [
  { value: 'registration', label: 'Registration & payment' },
  { value: 'abstract', label: 'Abstract submission' },
  { value: 'speaking', label: 'Speaking opportunity' },
  { value: 'sponsorship', label: 'Sponsorship & exhibiting' },
  { value: 'partnership', label: 'Academic partnership' },
  { value: 'visa', label: 'Visa invitation letter' },
  { value: 'other', label: 'Something else' },
];

export default function ContactPage() {
  const toast = useToast();
  const { data: settings } = useSettings();
  const { data: menu } = useConferenceMenu();

  const conferenceOptions = [
    { value: '', label: 'Not conference-specific' },
    ...(menu?.flatMap((group) =>
      group.conferences.map((conference) => ({ value: conference.slug, label: conference.title })),
    ) ?? []),
  ];

  const methods = useForm<ContactFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { full_name: '', email: '', phone: '', subject: '', conference: '', message: '' },
  });

  const onSubmit = methods.handleSubmit(async (values) => {
    try {
      const response = await pageApi.submitContact(values);
      toast.success(response.message ?? 'Thank you — we will be in touch shortly.');
      methods.reset();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  });

  return (
    <>
      <Seo
        title="Contact Us"
        description="Contact the GlobalScion conference secretariat about registration, abstracts, sponsorship, partnerships or delegate support."
        canonicalPath={PUBLIC_PATHS.contact}
      />

      <PageHero
        eyebrow="Contact"
        title="Talk to the secretariat"
        description="We answer every enquiry within one working day. Offices across five time zones mean there is always a team on shift."
        image={img.wide(HERO_IMAGES.handshake, 1800)}
        breadcrumb={[{ label: 'Contact' }]}
      />

      <Section>
        <Grid container spacing={{ xs: 5, lg: 8 }}>
          <Grid size={{ xs: 12, lg: 5 }}>
            <SectionHeading
              eyebrow="Get in touch"
              title="How to reach us"
              description="For urgent matters within 48 hours of an event, call the number below rather than emailing."
            />

            <Stack spacing={3}>
              <Stack direction="row" spacing={2}>
                <Box sx={{ color: 'secondary.dark', mt: 0.3 }}>
                  <MailOutlineIcon />
                </Box>
                <Box>
                  <Typography variant="h6" component="h3">
                    Email
                  </Typography>
                  <Box
                    component="a"
                    href={`mailto:${settings?.contact_email}`}
                    sx={{ display: 'block', color: 'text.secondary', textDecoration: 'none', mt: 0.5 }}
                  >
                    {settings?.contact_email} — general enquiries
                  </Box>
                  <Box
                    component="a"
                    href={`mailto:${settings?.support_email}`}
                    sx={{ display: 'block', color: 'text.secondary', textDecoration: 'none' }}
                  >
                    {settings?.support_email} — delegate support
                  </Box>
                </Box>
              </Stack>

              <Stack direction="row" spacing={2}>
                <Box sx={{ color: 'secondary.dark', mt: 0.3 }}>
                  <PhoneInTalkOutlinedIcon />
                </Box>
                <Box>
                  <Typography variant="h6" component="h3">
                    Telephone
                  </Typography>
                  <Box
                    component="a"
                    href={`tel:${settings?.phone.replace(/\s/g, '')}`}
                    sx={{ display: 'block', color: 'text.secondary', textDecoration: 'none', mt: 0.5 }}
                  >
                    {settings?.phone}
                  </Box>
                  <Typography variant="caption" color="text.disabled">
                    Monday to Friday, 08:00–18:00 GMT
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={2}>
                <Box sx={{ color: 'secondary.dark', mt: 0.3 }}>
                  <PlaceOutlinedIcon />
                </Box>
                <Box>
                  <Typography variant="h6" component="h3">
                    Offices
                  </Typography>
                  <Stack spacing={1.25} sx={{ mt: 1 }}>
                    {settings?.offices.map((office) => (
                      <Box key={office.country}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary' }}>
                          {office.country}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {office.address}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, lg: 7 }}>
            <Box
              sx={{
                p: { xs: 3, md: 4.5 },
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.paper',
              }}
            >
              <Typography variant="h3" component="h2" sx={{ mb: 3 }}>
                Send us a message
              </Typography>

              <FormProvider {...methods}>
                <Box component="form" onSubmit={onSubmit} noValidate>
                  <Grid container spacing={2.5}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <RHFTextField<ContactFormValues> name="full_name" label="Full name" required />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <RHFTextField<ContactFormValues> name="email" label="Email address" type="email" required />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <RHFTextField<ContactFormValues> name="phone" label="Telephone (optional)" />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <RHFSelect<ContactFormValues>
                        name="subject"
                        label="Enquiry type"
                        options={SUBJECTS}
                        required
                      />
                    </Grid>
                    <Grid size={12}>
                      <RHFSelect<ContactFormValues>
                        name="conference"
                        label="Related conference (optional)"
                        options={conferenceOptions}
                      />
                    </Grid>
                    <Grid size={12}>
                      <RHFTextField<ContactFormValues>
                        name="message"
                        label="Message"
                        multiline
                        minRows={5}
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
                        {methods.formState.isSubmitting ? 'Sending…' : 'Send message'}
                      </Button>
                      <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 2 }}>
                        By submitting this form you agree to our privacy policy. We use your details only to
                        respond to your enquiry.
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </FormProvider>
            </Box>
          </Grid>
        </Grid>
      </Section>
    </>
  );
}
