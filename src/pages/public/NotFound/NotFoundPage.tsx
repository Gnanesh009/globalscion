import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Seo } from '@/components/common/Seo';
import { PUBLIC_PATHS } from '@/constants';

export default function NotFoundPage() {
  return (
    <>
      <Seo title="Page not found" noIndex />
      <Container sx={{ py: { xs: 10, md: 18 }, textAlign: 'center' }}>
        <Typography
          aria-hidden
          sx={{
            fontSize: { xs: '5rem', md: '8rem' },
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: '-0.04em',
            color: 'grey.200',
          }}
        >
          404
        </Typography>
        <Typography variant="h1" component="h1" sx={{ mt: 2 }}>
          We couldn’t find that page
        </Typography>
        <Typography variant="lead" component="p" color="text.secondary" sx={{ mt: 2.5, maxWidth: 520, mx: 'auto' }}>
          The page may have moved, or a conference edition may have been archived. Browse the current
          programme or get in touch with the secretariat.
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="center" sx={{ mt: 5 }}>
          <Button
            component={RouterLink}
            to={PUBLIC_PATHS.conferences}
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
          >
            Browse conferences
          </Button>
          <Button component={RouterLink} to={PUBLIC_PATHS.home} variant="outlined" size="large">
            Back to home
          </Button>
        </Stack>

        <Box sx={{ mt: 6 }}>
          <Button component={RouterLink} to={PUBLIC_PATHS.contact} variant="text">
            Contact the secretariat
          </Button>
        </Box>
      </Container>
    </>
  );
}
