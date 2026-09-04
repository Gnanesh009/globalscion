import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import type { Review } from '@/types';
import { initialsOf } from '@/utils/format';

export function ReviewCard({ review }: { review: Review }) {
  return (
    <Box
      component="figure"
      sx={{
        m: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        p: { xs: 3, md: 3.5 },
        borderRadius: 1,
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        transition: 'box-shadow 240ms, transform 240ms',
        '&:hover': { boxShadow: '0 16px 40px rgba(11,31,58,0.09)', transform: 'translateY(-2px)' },
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Rating value={review.rating} readOnly size="small" sx={{ color: 'warning.main' }} />
        <FormatQuoteIcon aria-hidden sx={{ fontSize: 30, color: 'grey.200' }} />
      </Stack>

      <Typography
        component="blockquote"
        sx={{ m: 0, mt: 2, flex: 1, fontSize: '1rem', lineHeight: 1.7, color: 'text.primary' }}
      >
        “{review.review}”
      </Typography>

      <Stack
        component="figcaption"
        direction="row"
        spacing={1.75}
        alignItems="center"
        sx={{ mt: 3, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}
      >
        <Avatar src={review.photo ?? undefined} alt="" sx={{ width: 44, height: 44 }}>
          {initialsOf(review.name)}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', lineHeight: 1.3 }}>
            {review.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            {review.designation}
          </Typography>
          <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>
            {review.organization} · {review.country}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}
