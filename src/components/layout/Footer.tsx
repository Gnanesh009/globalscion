import { useState, type FormEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import XIcon from '@mui/icons-material/X';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneInTalkOutlinedIcon from '@mui/icons-material/PhoneInTalkOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Logo } from '@/components/common/Logo';
import { pageApi } from '@/api/pageApi';
import { useToast } from '@/app/ToastProvider';
import { FOOTER_LEGAL_LINKS, FOOTER_QUICK_LINKS, PUBLIC_PATHS } from '@/constants';
import { useConferenceMenu } from '@/hooks/useConferences';
import { useSettings } from '@/hooks/useResources';
import { getErrorMessage } from '@/api/apiClient';

const linkSx = {
  display: 'block',
  py: 0.7,
  fontSize: '0.9375rem',
  color: 'rgba(255,255,255,0.66)',
  textDecoration: 'none',
  transition: 'color 160ms',
  '&:hover': { color: 'common.white' },
  '&:focus-visible': { outline: '2px solid', outlineColor: 'secondary.light', outlineOffset: 3 },
} as const;

function FooterHeading({ children }: { children: string }) {
  return (
    <Typography
      variant="eyebrow"
      component="h2"
      sx={{ color: 'secondary.light', mb: 2.5, letterSpacing: '0.13em' }}
    >
      {children}
    </Typography>
  );
}

export function Footer() {
  const { data: settings } = useSettings();
  const { data: menu } = useConferenceMenu();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const conferences = menu?.flatMap((group) => group.conferences).slice(0, 6) ?? [];
  const categories = menu?.map((group) => group.category).slice(0, 7) ?? [];

  const social = settings?.social;
  const socialLinks = [
    { icon: <LinkedInIcon fontSize="small" />, href: social?.linkedin, label: 'LinkedIn' },
    { icon: <XIcon sx={{ fontSize: 17 }} />, href: social?.twitter, label: 'X' },
    { icon: <FacebookIcon fontSize="small" />, href: social?.facebook, label: 'Facebook' },
    { icon: <InstagramIcon fontSize="small" />, href: social?.instagram, label: 'Instagram' },
    { icon: <YouTubeIcon fontSize="small" />, href: social?.youtube, label: 'YouTube' },
  ].filter((item) => Boolean(item.href));

  const onSubscribe = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await pageApi.subscribe(email);
      toast.success('You’re subscribed. Programme announcements will arrive in your inbox.');
      setEmail('');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box component="footer" sx={{ backgroundColor: 'primary.dark', color: 'common.white', mt: 'auto' }}>
      {/* Newsletter band */}
      <Box sx={{ borderBottom: '1px solid rgba(255,255,255,0.10)' }}>
        <Container>
          <Grid container spacing={4} alignItems="center" sx={{ py: { xs: 5, md: 6 } }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h3" component="p" sx={{ color: 'common.white' }}>
                Programme announcements, straight to your inbox
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255,255,255,0.62)' }}>
                Abstract deadlines, new editions and early-bird rates. No more than twice a month.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack
                component="form"
                onSubmit={onSubscribe}
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
              >
                <InputBase
                  required
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="your.name@institution.org"
                  inputProps={{ 'aria-label': 'Email address for programme announcements' }}
                  sx={{
                    flex: 1,
                    px: 2,
                    py: 1.4,
                    borderRadius: 1,
                    backgroundColor: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.16)',
                    color: 'common.white',
                    fontSize: '0.9375rem',
                    '& input::placeholder': { color: 'rgba(255,255,255,0.45)', opacity: 1 },
                    '&:focus-within': { borderColor: 'secondary.light' },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  disabled={submitting}
                  endIcon={<ArrowForwardIcon />}
                  sx={{ flexShrink: 0 }}
                >
                  {submitting ? 'Subscribing…' : 'Subscribe'}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container>
        <Grid container spacing={{ xs: 5, md: 4 }} sx={{ py: { xs: 6, md: 9 } }}>
          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <Logo variant="light" showTagline />
            <Typography variant="body2" sx={{ mt: 2.5, color: 'rgba(255,255,255,0.62)', maxWidth: 340 }}>
              {settings?.footer_description}
            </Typography>
            <Stack direction="row" spacing={0.5} sx={{ mt: 3 }}>
              {socialLinks.map((item) => (
                <IconButton
                  key={item.label}
                  href={item.href!}
                  target="_blank"
                  rel="noopener"
                  aria-label={`GlobalScion on ${item.label}`}
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    border: '1px solid rgba(255,255,255,0.16)',
                    borderRadius: 1,
                    '&:hover': { color: 'common.white', borderColor: 'secondary.light', backgroundColor: 'rgba(255,255,255,0.06)' },
                  }}
                >
                  {item.icon}
                </IconButton>
              ))}
            </Stack>
          </Grid>

          <Grid size={{ xs: 6, md: 3, lg: 2 }}>
            <FooterHeading>Quick links</FooterHeading>
            <Stack component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {FOOTER_QUICK_LINKS.map((link) => (
                <Box component="li" key={link.href}>
                  <Box component={RouterLink} to={link.href} sx={linkSx}>
                    {link.label}
                  </Box>
                </Box>
              ))}
            </Stack>
          </Grid>

          <Grid size={{ xs: 6, md: 3, lg: 2 }}>
            <FooterHeading>Categories</FooterHeading>
            <Stack component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {categories.map((category) => (
                <Box component="li" key={category.id}>
                  <Box
                    component={RouterLink}
                    to={`${PUBLIC_PATHS.conferences}?category=${category.slug}`}
                    sx={linkSx}
                  >
                    {category.name}
                  </Box>
                </Box>
              ))}
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <FooterHeading>Conferences</FooterHeading>
            <Stack component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {conferences.map((conference) => (
                <Box component="li" key={conference.id}>
                  <Box
                    component={RouterLink}
                    to={PUBLIC_PATHS.conferenceDetails(conference.slug)}
                    sx={{ ...linkSx, lineHeight: 1.45 }}
                  >
                    {conference.title}
                  </Box>
                </Box>
              ))}
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 2 }}>
            <FooterHeading>Contact</FooterHeading>
            <Stack spacing={1.75}>
              <Stack direction="row" spacing={1.25}>
                <MailOutlineIcon sx={{ fontSize: 17, color: 'secondary.light', mt: 0.3 }} />
                <Box>
                  <Box component="a" href={`mailto:${settings?.contact_email}`} sx={{ ...linkSx, py: 0 }}>
                    {settings?.contact_email}
                  </Box>
                  <Box component="a" href={`mailto:${settings?.support_email}`} sx={{ ...linkSx, py: 0 }}>
                    {settings?.support_email}
                  </Box>
                </Box>
              </Stack>
              <Stack direction="row" spacing={1.25}>
                <PhoneInTalkOutlinedIcon sx={{ fontSize: 17, color: 'secondary.light', mt: 0.3 }} />
                <Box component="a" href={`tel:${settings?.phone.replace(/\s/g, '')}`} sx={{ ...linkSx, py: 0 }}>
                  {settings?.phone}
                </Box>
              </Stack>
              <Stack direction="row" spacing={1.25}>
                <PlaceOutlinedIcon sx={{ fontSize: 17, color: 'secondary.light', mt: 0.3 }} />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.66)', lineHeight: 1.6 }}>
                  {settings?.address}
                </Typography>
              </Stack>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.10)' }} />

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
          spacing={2}
          sx={{ py: 3.5 }}
        >
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
            © {new Date().getFullYear()} {settings?.website_name ?? 'GlobalScion'} Conferences Ltd. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={3} flexWrap="wrap">
            {FOOTER_LEGAL_LINKS.map((link) => (
              <Box
                key={link.href}
                component={RouterLink}
                to={link.href}
                sx={{ ...linkSx, py: 0, fontSize: '0.8125rem' }}
              >
                {link.label}
              </Box>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
