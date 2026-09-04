import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  /** Adds a rule above the block — use for the second section onwards. */
  divider?: boolean;
}

export function FormSection({ title, description, children, divider = false }: FormSectionProps) {
  return (
    <Box sx={{ mb: 4 }}>
      {divider && <Divider sx={{ mb: 4 }} />}
      <Typography variant="h4" component="h3" sx={{ mb: description ? 0.5 : 2.5 }}>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, maxWidth: 640 }}>
          {description}
        </Typography>
      )}
      {children}
    </Box>
  );
}
