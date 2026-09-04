import type { ElementType, ReactNode } from 'react';
import Box, { type BoxProps } from '@mui/material/Box';
import Container from '@mui/material/Container';

type SectionTone = 'default' | 'surface' | 'navy' | 'tint';

interface SectionProps extends Omit<BoxProps, 'component'> {
  children: ReactNode;
  tone?: SectionTone;
  component?: ElementType;
  disableGutters?: boolean;
  /** Compact vertical rhythm for dense sections such as breadcrumbs. */
  dense?: boolean;
}

const toneStyles: Record<SectionTone, BoxProps['sx']> = {
  default: { backgroundColor: 'background.default' },
  surface: { backgroundColor: 'background.paper' },
  tint: { backgroundColor: '#F2F5FA' },
  navy: { backgroundColor: 'primary.dark', color: 'common.white' },
};

/**
 * Consistent vertical rhythm for every public page band.
 * Keeping this in one component is what makes the site feel composed rather
 * than assembled — nothing sets its own ad-hoc padding.
 */
export function Section({
  children,
  tone = 'default',
  component = 'section',
  dense = false,
  disableGutters,
  sx,
  ...rest
}: SectionProps) {
  return (
    <Box
      component={component}
      sx={[
        { py: dense ? { xs: 4, md: 6 } : { xs: 7, md: 12 } },
        toneStyles[tone] as never,
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...rest}
    >
      {disableGutters ? children : <Container>{children}</Container>}
    </Box>
  );
}
