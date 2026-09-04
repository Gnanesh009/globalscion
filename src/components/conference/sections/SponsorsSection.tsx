import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Section } from '@/components/common/Section';
import { SectionHeading } from '@/components/common/SectionHeading';
import { SPONSOR_TIER_OPTIONS } from '@/constants';
import type { Sponsor } from '@/types';
import type { ConferenceSectionProps } from './types';

/** Logo files are optional in the CMS, so a typographic mark is always available. */
function SponsorTile({ sponsor }: { sponsor: Sponsor }) {
  return (
    <Box
      component={sponsor.website ? 'a' : 'div'}
      href={sponsor.website ?? undefined}
      target={sponsor.website ? '_blank' : undefined}
      rel={sponsor.website ? 'noopener' : undefined}
      title={sponsor.description}
      sx={{
        display: 'grid',
        placeItems: 'center',
        textAlign: 'center',
        minHeight: 104,
        px: 2.5,
        py: 2,
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        textDecoration: 'none',
        transition: 'border-color 220ms, box-shadow 220ms',
        '&:hover': { borderColor: 'secondary.main', boxShadow: '0 10px 26px rgba(11,31,58,0.08)' },
      }}
    >
      {sponsor.logo ? (
        <Box
          component="img"
          src={sponsor.logo}
          alt={sponsor.name}
          loading="lazy"
          sx={{ maxHeight: 52, maxWidth: '100%', objectFit: 'contain' }}
        />
      ) : (
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: '0.9375rem',
            color: 'text.primary',
            letterSpacing: '-0.01em',
            lineHeight: 1.35,
          }}
        >
          {sponsor.name}
        </Typography>
      )}
    </Box>
  );
}

export function SponsorsSection({ conference }: ConferenceSectionProps) {
  if (!conference.sponsors.length) return null;

  const tiers = SPONSOR_TIER_OPTIONS.map((tier) => ({
    ...tier,
    sponsors: conference.sponsors.filter((sponsor) => sponsor.tier === tier.value),
  })).filter((tier) => tier.sponsors.length > 0);

  return (
    <Section tone="tint" id="sponsors">
      <SectionHeading
        eyebrow="Partners"
        title="Sponsors, collaborators and media partners"
        description="Partners support the event. They do not select speakers or shape the scientific programme."
        align="center"
        maxWidth={640}
      />

      <Stack spacing={5}>
        {tiers.map((tier) => (
          <Box key={tier.value}>
            <Typography
              variant="eyebrow"
              component="h3"
              sx={{ color: 'text.disabled', textAlign: 'center', mb: 2.5 }}
            >
              {tier.label}
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: {
                  xs: 'repeat(2, 1fr)',
                  sm: 'repeat(3, 1fr)',
                  lg: `repeat(${Math.min(tier.sponsors.length, 4)}, 1fr)`,
                },
                justifyContent: 'center',
                maxWidth: tier.sponsors.length < 4 ? 840 : '100%',
                mx: 'auto',
              }}
            >
              {tier.sponsors.map((sponsor) => (
                <SponsorTile key={sponsor.id} sponsor={sponsor} />
              ))}
            </Box>
          </Box>
        ))}
      </Stack>
    </Section>
  );
}
