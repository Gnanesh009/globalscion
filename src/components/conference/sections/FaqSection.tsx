import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import { Section } from '@/components/common/Section';
import { SectionHeading } from '@/components/common/SectionHeading';
import type { ConferenceSectionProps } from './types';

export function FaqSection({ conference }: ConferenceSectionProps) {
  const faqs = [...conference.faqs].sort((a, b) => a.display_order - b.display_order);
  if (!faqs.length) return null;

  return (
    <Section tone="surface" id="faq">
      <Grid container spacing={{ xs: 4, lg: 8 }}>
        <Grid size={{ xs: 12, lg: 4 }}>
          <SectionHeading
            eyebrow="FAQ"
            title="Frequently asked questions"
            description="Cannot find an answer? The secretariat responds to every enquiry within one working day."
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Box>
            {faqs.map((faq) => (
              <Accordion key={faq.id}>
                <AccordionSummary
                  expandIcon={<AddIcon sx={{ fontSize: 20 }} />}
                  sx={{
                    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': { transform: 'rotate(45deg)' },
                  }}
                >
                  <Typography sx={{ fontWeight: 700, fontSize: '1rem', pr: 2 }}>{faq.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" color="text.secondary">
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Section>
  );
}
