import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import AccessibilityNewOutlinedIcon from '@mui/icons-material/AccessibilityNewOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import { HERO_IMAGES, SUBJECT_IMAGES, img } from '@/api/mock/images';
import { PageHero } from '@/components/common/PageHero';
import { RichTextContent } from '@/components/common/RichTextContent';
import { Section } from '@/components/common/Section';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Seo } from '@/components/common/Seo';
import { ErrorState } from '@/components/common/States';
import { PUBLIC_PATHS } from '@/constants';
import { usePage } from '@/hooks/useResources';
import Skeleton from '@mui/material/Skeleton';
import { HomeFinalCta } from '../Home/sections/HomeFinalCta';
import { StatisticsSection } from '../Home/sections/StatisticsSection';

const COMMITMENTS = [
  {
    icon: <VerifiedOutlinedIcon />,
    title: 'Quality & rigour',
    text: 'Independent peer review, published assessment criteria, and no pay-to-speak slots — ever.',
  },
  {
    icon: <LightbulbOutlinedIcon />,
    title: 'Innovation-driven themes',
    text: 'Programmes shaped by where a field is heading, not by what filled seats at the last edition.',
  },
  {
    icon: <AccessibilityNewOutlinedIcon />,
    title: 'Inclusivity & accessibility',
    text: 'Student rates, LMIC bursaries, captioning and accessible venues as standard rather than on request.',
  },
  {
    icon: <AutoAwesomeOutlinedIcon />,
    title: 'A seamless experience',
    text: 'Punctual sessions, responsive support, and recordings and certificates delivered on schedule.',
  },
];

export default function AboutPage() {
  const { data: page, isPending, isError, error, refetch } = usePage('about');

  return (
    <>
      <Seo
        title={page?.seo.meta_title ?? 'About GlobalScion'}
        description={
          page?.seo.meta_description ??
          'GlobalScion organises peer-reviewed international scientific and medical conferences across more than fifty countries.'
        }
        canonicalPath={PUBLIC_PATHS.about}
      />

      <PageHero
        eyebrow="About us"
        title={page?.title ?? 'About GlobalScion'}
        description={page?.hero_subtitle}
        image={img.wide(HERO_IMAGES.panel, 1800)}
        breadcrumb={[{ label: 'About' }]}
      />

      <Section>
        <Grid container spacing={{ xs: 5, lg: 9 }}>
          <Grid size={{ xs: 12, lg: 7 }}>
            {isPending && (
              <Stack spacing={1.5}>
                {Array.from({ length: 12 }).map((_, index) => (
                  <Skeleton key={index} height={20} width={index % 4 === 3 ? '70%' : '100%'} />
                ))}
              </Stack>
            )}
            {isError && <ErrorState error={error} onRetry={() => void refetch()} />}
            {page && <RichTextContent html={page.content} />}
          </Grid>

          <Grid size={{ xs: 12, lg: 5 }}>
            <Box sx={{ position: { lg: 'sticky' }, top: { lg: 110 } }}>
              <Box
                component="img"
                src={img.card(SUBJECT_IMAGES.team, 900)}
                alt="The GlobalScion conference team at work"
                loading="lazy"
                sx={{ width: '100%', borderRadius: 1, aspectRatio: '4 / 3', objectFit: 'cover' }}
              />
              <Box
                sx={{
                  mt: 3,
                  p: 3.5,
                  borderRadius: 1,
                  backgroundColor: 'primary.dark',
                  color: 'common.white',
                }}
              >
                <Typography variant="eyebrow" sx={{ color: 'secondary.light' }}>
                  Our position
                </Typography>
                <Typography sx={{ mt: 1.5, fontSize: '1.0625rem', lineHeight: 1.65 }}>
                  Sponsors support our events. They do not select speakers, write sessions or influence the
                  scientific programme. That separation is the reason delegates trust what they hear.
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Section>

      <Section tone="surface">
        <SectionHeading
          eyebrow="Core commitments"
          title="What we hold ourselves to"
          align="center"
          maxWidth={640}
        />
        <Grid container spacing={{ xs: 3, md: 4 }}>
          {COMMITMENTS.map((item) => (
            <Grid key={item.title} size={{ xs: 12, sm: 6, lg: 3 }}>
              <Box
                sx={{
                  height: '100%',
                  p: 3.5,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box
                  aria-hidden
                  sx={{
                    width: 44,
                    height: 44,
                    mb: 2.5,
                    borderRadius: 1,
                    display: 'grid',
                    placeItems: 'center',
                    backgroundColor: 'rgba(14,124,134,0.10)',
                    color: 'secondary.dark',
                  }}
                >
                  {item.icon}
                </Box>
                <Typography variant="h5" component="h3" sx={{ mb: 1 }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.text}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Section>

      <StatisticsSection />
      <HomeFinalCta />
    </>
  );
}
