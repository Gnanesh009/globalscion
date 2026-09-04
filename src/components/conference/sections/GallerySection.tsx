import { useState } from 'react';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';
import { Section } from '@/components/common/Section';
import { SectionHeading } from '@/components/common/SectionHeading';
import type { ConferenceSectionProps } from './types';

export function GallerySection({ conference }: ConferenceSectionProps) {
  const images = [...conference.gallery].sort((a, b) => a.display_order - b.display_order);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!images.length) return null;

  const step = (delta: number) =>
    setOpenIndex((current) =>
      current === null ? null : (current + delta + images.length) % images.length,
    );

  return (
    <Section id="gallery">
      <SectionHeading
        eyebrow="Gallery"
        title="From previous editions"
        description="Photographs from earlier GlobalScion events in this series."
      />

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        }}
      >
        {images.map((image, index) => (
          <Box
            key={image.id}
            component="button"
            onClick={() => setOpenIndex(index)}
            aria-label={`Open image: ${image.caption}`}
            sx={{
              position: 'relative',
              p: 0,
              border: 'none',
              cursor: 'pointer',
              overflow: 'hidden',
              borderRadius: 1,
              aspectRatio: index % 5 === 0 ? '1 / 1' : '4 / 3',
              gridRow: index % 5 === 0 ? { md: 'span 2' } : undefined,
              gridColumn: index % 5 === 0 ? { md: 'span 2' } : undefined,
              backgroundColor: 'grey.100',
              '&:hover img': { transform: 'scale(1.06)' },
              '&:focus-visible': { outline: '2px solid', outlineColor: 'secondary.main', outlineOffset: 2 },
            }}
          >
            <Box
              component="img"
              src={image.image}
              alt={image.caption}
              loading="lazy"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                transition: 'transform 600ms cubic-bezier(0.16,1,0.3,1)',
              }}
            />
          </Box>
        ))}
      </Box>

      <Dialog
        open={openIndex !== null}
        onClose={() => setOpenIndex(null)}
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: { backgroundColor: '#060F1E', position: 'relative' } }}
      >
        {openIndex !== null && (
          <Box sx={{ position: 'relative' }}>
            <IconButton
              onClick={() => setOpenIndex(null)}
              aria-label="Close gallery"
              sx={{ position: 'absolute', top: 10, right: 10, color: 'common.white', zIndex: 1 }}
            >
              <CloseIcon />
            </IconButton>
            <IconButton
              onClick={() => step(-1)}
              aria-label="Previous image"
              sx={{ position: 'absolute', left: 10, top: '50%', color: 'common.white', zIndex: 1 }}
            >
              <ArrowBackIosNewIcon />
            </IconButton>
            <IconButton
              onClick={() => step(1)}
              aria-label="Next image"
              sx={{ position: 'absolute', right: 10, top: '50%', color: 'common.white', zIndex: 1 }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
            <Box
              component="img"
              src={images[openIndex].image}
              alt={images[openIndex].caption}
              sx={{ width: '100%', maxHeight: '78vh', objectFit: 'contain', display: 'block' }}
            />
            <Typography sx={{ p: 2.5, color: 'rgba(255,255,255,0.8)', textAlign: 'center' }}>
              {images[openIndex].caption}
            </Typography>
          </Box>
        )}
      </Dialog>
    </Section>
  );
}
