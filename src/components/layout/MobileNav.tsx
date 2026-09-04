import { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Logo } from '@/components/common/Logo';
import { PRIMARY_NAV, PUBLIC_PATHS } from '@/constants';
import { useConferenceMenu } from '@/hooks/useConferences';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const { pathname } = useLocation();
  const { data: groups, isPending } = useConferenceMenu();
  const [expanded, setExpanded] = useState<string | false>(false);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      PaperProps={{ sx: { width: { xs: '100%', sm: 400 }, display: 'flex', flexDirection: 'column' } }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 2.5, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <RouterLink to={PUBLIC_PATHS.home} onClick={onClose} aria-label="GlobalScion home">
          <Logo compact />
        </RouterLink>
        <IconButton onClick={onClose} aria-label="Close navigation menu">
          <CloseIcon />
        </IconButton>
      </Stack>

      <Box component="nav" aria-label="Mobile" sx={{ flex: 1, overflowY: 'auto' }}>
        {PRIMARY_NAV.map((item) =>
          item.megaMenu ? (
            <Accordion
              key={item.href}
              expanded={expanded === item.href}
              onChange={(_, isExpanded) => setExpanded(isExpanded ? item.href : false)}
              sx={{ border: 'none', borderBottom: '1px solid', borderColor: 'divider' }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2.5 }}>
                <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>{item.label}</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 2.5, pt: 0 }}>
                {isPending ? (
                  <Stack spacing={1}>
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} height={22} />
                    ))}
                  </Stack>
                ) : (
                  <Stack spacing={2.5}>
                    {groups?.map(({ category, conferences }) => (
                      <Box key={category.id}>
                        <Typography
                          variant="eyebrow"
                          component="p"
                          sx={{ color: 'secondary.main', mb: 1 }}
                        >
                          {category.name}
                        </Typography>
                        <Stack component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                          {conferences.map((conference) => (
                            <Box component="li" key={conference.id}>
                              <Box
                                component={RouterLink}
                                to={PUBLIC_PATHS.conferenceDetails(conference.slug)}
                                onClick={onClose}
                                sx={{
                                  display: 'block',
                                  py: 0.85,
                                  fontSize: '0.9375rem',
                                  color: 'text.secondary',
                                  textDecoration: 'none',
                                  lineHeight: 1.4,
                                }}
                              >
                                {conference.title}
                              </Box>
                            </Box>
                          ))}
                        </Stack>
                      </Box>
                    ))}
                    <Button
                      component={RouterLink}
                      to={PUBLIC_PATHS.conferences}
                      onClick={onClose}
                      variant="outlined"
                      fullWidth
                    >
                      View all conferences
                    </Button>
                  </Stack>
                )}
              </AccordionDetails>
            </Accordion>
          ) : (
            <Box
              key={item.href}
              component={RouterLink}
              to={item.href}
              onClick={onClose}
              sx={{
                display: 'block',
                px: 2.5,
                py: 2.5,
                fontWeight: 700,
                fontSize: '1rem',
                textDecoration: 'none',
                color: pathname === item.href ? 'secondary.dark' : 'text.primary',
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              {item.label}
            </Box>
          ),
        )}
      </Box>

      <Divider />
      <Stack spacing={1.5} sx={{ p: 2.5 }}>
        <Button
          component={RouterLink}
          to={PUBLIC_PATHS.conferences}
          onClick={onClose}
          variant="contained"
          color="secondary"
          size="large"
          fullWidth
        >
          Explore conferences
        </Button>
        <Button
          component={RouterLink}
          to={PUBLIC_PATHS.contact}
          onClick={onClose}
          variant="text"
          fullWidth
        >
          Contact the secretariat
        </Button>
      </Stack>
    </Drawer>
  );
}
