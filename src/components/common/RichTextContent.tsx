import Box, { type BoxProps } from '@mui/material/Box';

interface RichTextContentProps extends Omit<BoxProps, 'children'> {
  /** Trusted HTML authored in the admin rich text editor and sanitised server-side. */
  html: string;
  inverted?: boolean;
}

/**
 * Applies the site's typographic scale to CMS-authored HTML so editor output
 * never looks like unstyled markup.
 */
export function RichTextContent({ html, inverted = false, sx, ...rest }: RichTextContentProps) {
  return (
    <Box
      {...rest}
      dangerouslySetInnerHTML={{ __html: html }}
      sx={[
        {
          color: inverted ? 'rgba(255,255,255,0.82)' : 'text.secondary',
          '& > *:first-of-type': { mt: 0 },
          '& > *:last-child': { mb: 0 },
          '& p': { fontSize: '1.0625rem', lineHeight: 1.75, my: 2.5 },
          '& h2': {
            fontSize: '1.625rem',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: inverted ? 'common.white' : 'text.primary',
            mt: 5,
            mb: 2,
          },
          '& h3': {
            fontSize: '1.25rem',
            fontWeight: 700,
            letterSpacing: '-0.015em',
            color: inverted ? 'common.white' : 'text.primary',
            mt: 4.5,
            mb: 1.5,
          },
          '& h4': { fontSize: '1.0625rem', fontWeight: 700, color: 'text.primary', mt: 3.5, mb: 1 },
          '& strong': { color: inverted ? 'common.white' : 'text.primary', fontWeight: 700 },
          '& ul, & ol': { pl: 3, my: 2.5, '& li': { mb: 1, lineHeight: 1.7 } },
          '& a': {
            color: inverted ? 'secondary.light' : 'info.main',
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
            '&:hover': { color: inverted ? 'common.white' : 'info.dark' },
          },
          '& blockquote': {
            m: 0,
            my: 3.5,
            pl: 3,
            borderLeft: '3px solid',
            borderColor: 'secondary.main',
            fontStyle: 'italic',
            fontSize: '1.125rem',
            color: inverted ? 'common.white' : 'text.primary',
          },
          '& img': { maxWidth: '100%', height: 'auto', borderRadius: 1, my: 3 },
          '& table': {
            width: '100%',
            borderCollapse: 'collapse',
            my: 3,
            fontSize: '0.9375rem',
            '& th, & td': { border: '1px solid', borderColor: 'divider', p: 1.5, textAlign: 'left' },
            '& th': { backgroundColor: 'grey.50', fontWeight: 700, color: 'text.primary' },
          },
          '& hr': { border: 0, borderTop: '1px solid', borderColor: 'divider', my: 5 },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    />
  );
}
