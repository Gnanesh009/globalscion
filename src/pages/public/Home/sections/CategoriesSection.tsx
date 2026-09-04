import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import EastIcon from '@mui/icons-material/East';
import { Section } from '@/components/common/Section';
import { SectionHeading } from '@/components/common/SectionHeading';
import { PUBLIC_PATHS } from '@/constants';
import { useCategories } from '@/hooks/useResources';

export function CategoriesSection() {
  const { data, isPending } = useCategories();
  const categories = data?.results ?? [];

  return (
    <Section tone="tint">
      <SectionHeading
        eyebrow="Disciplines"
        title="Conference categories"
        description="Browse the programme by scientific discipline. Categories are maintained in the CMS, so new fields appear here automatically."
      />

      <Grid container spacing={{ xs: 2.5, md: 3 }}>
        {isPending
          ? Array.from({ length: 7 }).map((_, index) => (
              <Grid key={index} size={{ xs: 12, sm: 6, lg: 4 }}>
                <Skeleton variant="rectangular" height={150} />
              </Grid>
            ))
          : categories.map((category) => (
              <Grid key={category.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                <Box
                  component={RouterLink}
                  to={`${PUBLIC_PATHS.conferences}?category=${category.slug}`}
                  sx={{
                    display: 'block',
                    height: '100%',
                    p: 3.5,
                    textDecoration: 'none',
                    borderRadius: 1,
                    backgroundColor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'transform 240ms, box-shadow 240ms, border-color 240ms',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      borderColor: 'transparent',
                      boxShadow: '0 18px 42px rgba(11,31,58,0.10)',
                    },
                    '&:hover .cat-arrow': { transform: 'translateX(4px)' },
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Typography variant="h4" component="h3" sx={{ color: 'text.primary' }}>
                        {category.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: 'secondary.dark', fontWeight: 700, letterSpacing: '0.03em' }}
                      >
                        {category.conference_count}{' '}
                        {category.conference_count === 1 ? 'conference' : 'conferences'}
                      </Typography>
                    </Box>
                    <EastIcon
                      className="cat-arrow"
                      sx={{ fontSize: 18, color: 'secondary.main', transition: 'transform 240ms' }}
                    />
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    {category.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
      </Grid>
    </Section>
  );
}
