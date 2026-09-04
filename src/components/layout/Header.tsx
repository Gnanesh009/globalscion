import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import MenuIcon from '@mui/icons-material/Menu';
import PhoneInTalkOutlinedIcon from '@mui/icons-material/PhoneInTalkOutlined';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
import { Logo } from '@/components/common/Logo';
import { PRIMARY_NAV, PUBLIC_PATHS } from '@/constants';
import { useScrolled } from '@/hooks/useUi';
import { MegaMenu } from './MegaMenu';
import { MobileNav } from './MobileNav';

const CONTACT_EMAIL = 'info@globalscion.com';
const CONTACT_PHONE = '+44 20 3993 4471';

export function Header() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const scrolled = useScrolled(20);
  const { pathname } = useLocation();

  const [megaOpen, setMegaOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeTimer = useRef<number>();

  // Route change always dismisses any open surface.
  useEffect(() => {
    setMegaOpen(false);
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!megaOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMegaOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [megaOpen]);

  const openMega = () => {
    window.clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };

  // Short grace period so the pointer can travel from trigger to panel.
  const scheduleClose = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMegaOpen(false), 140);
  };

  const isActive = (href: string) =>
    href === PUBLIC_PATHS.home ? pathname === href : pathname.startsWith(href);

  return (
    <>
      <Box
        component="a"
        href="#main-content"
        sx={{
          position: 'absolute',
          left: 16,
          top: -60,
          zIndex: (t) => t.zIndex.appBar + 2,
          px: 2,
          py: 1.25,
          borderRadius: 1,
          backgroundColor: 'primary.main',
          color: 'common.white',
          fontWeight: 700,
          fontSize: '0.875rem',
          textDecoration: 'none',
          transition: 'top 160ms',
          '&:focus': { top: 16 },
        }}
      >
        Skip to main content
      </Box>

      <AppBar
        position="sticky"
        elevation={0}
        color="inherit"
        onMouseLeave={scheduleClose}
        sx={{
          backgroundColor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: scrolled ? 'divider' : 'transparent',
          boxShadow: scrolled ? '0 4px 20px rgba(11,31,58,0.07)' : 'none',
          transition: 'box-shadow 240ms, border-color 240ms',
        }}
      >
        {/* Utility bar — collapses away as soon as the page scrolls */}
        <Collapse in={!scrolled} timeout={220}>
          <Box
            sx={{
              display: { xs: 'none', lg: 'block' },
              backgroundColor: 'primary.dark',
              color: 'rgba(255,255,255,0.72)',
            }}
          >
            <Container>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ height: 40 }}>
                <Stack direction="row" spacing={3} alignItems="center">
                  <Stack
                    component="a"
                    href={`mailto:${CONTACT_EMAIL}`}
                    direction="row"
                    spacing={0.75}
                    alignItems="center"
                    sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: 'common.white' } }}
                  >
                    <MailOutlineIcon sx={{ fontSize: 15 }} />
                    <Typography variant="caption">{CONTACT_EMAIL}</Typography>
                  </Stack>
                  <Stack
                    component="a"
                    href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`}
                    direction="row"
                    spacing={0.75}
                    alignItems="center"
                    sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: 'common.white' } }}
                  >
                    <PhoneInTalkOutlinedIcon sx={{ fontSize: 15 }} />
                    <Typography variant="caption">{CONTACT_PHONE}</Typography>
                  </Stack>
                </Stack>

                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography variant="caption" sx={{ letterSpacing: '0.04em' }}>
                    Offices in the UK · US · India · Germany · UAE
                  </Typography>
                  <Stack direction="row" spacing={0.5}>
                    <IconButton
                      size="small"
                      href="https://linkedin.com/company/globalscion"
                      target="_blank"
                      rel="noopener"
                      aria-label="GlobalScion on LinkedIn"
                      sx={{ color: 'inherit', '&:hover': { color: 'common.white' } }}
                    >
                      <LinkedInIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      href="https://x.com/globalscion"
                      target="_blank"
                      rel="noopener"
                      aria-label="GlobalScion on X"
                      sx={{ color: 'inherit', '&:hover': { color: 'common.white' } }}
                    >
                      <XIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Stack>
                </Stack>
              </Stack>
            </Container>
          </Box>
        </Collapse>

        <Container>
          <Toolbar
            disableGutters
            sx={{
              minHeight: { xs: 64, lg: scrolled ? 66 : 86 },
              transition: 'min-height 240ms cubic-bezier(0.4,0,0.2,1)',
            }}
          >
            <Box component={RouterLink} to={PUBLIC_PATHS.home} aria-label="GlobalScion home" sx={{ mr: 'auto' }}>
              <Logo compact={scrolled} showTagline={!scrolled} />
            </Box>

            <Stack
              component="nav"
              aria-label="Primary"
              direction="row"
              spacing={0.5}
              alignItems="center"
              sx={{ display: { xs: 'none', lg: 'flex' }, mr: 3 }}
            >
              {PRIMARY_NAV.map((item) =>
                item.megaMenu ? (
                  <Button
                    key={item.href}
                    onClick={() => setMegaOpen((prev) => !prev)}
                    onMouseEnter={openMega}
                    aria-expanded={megaOpen}
                    aria-haspopup="true"
                    aria-controls="conferences-mega-menu"
                    endIcon={
                      <ExpandMoreIcon
                        sx={{
                          transition: 'transform 200ms',
                          transform: megaOpen ? 'rotate(180deg)' : 'none',
                        }}
                      />
                    }
                    sx={{
                      color: megaOpen || isActive(item.href) ? 'secondary.dark' : 'text.primary',
                      fontWeight: 700,
                      px: 1.75,
                    }}
                  >
                    {item.label}
                  </Button>
                ) : (
                  <Button
                    key={item.href}
                    component={RouterLink}
                    to={item.href}
                    onMouseEnter={scheduleClose}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    sx={{
                      color: isActive(item.href) ? 'secondary.dark' : 'text.primary',
                      fontWeight: 700,
                      px: 1.75,
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        left: 14,
                        right: 14,
                        bottom: 8,
                        height: 2,
                        backgroundColor: 'secondary.main',
                        transform: isActive(item.href) ? 'scaleX(1)' : 'scaleX(0)',
                        transformOrigin: 'left',
                        transition: 'transform 220ms cubic-bezier(0.16,1,0.3,1)',
                      },
                      '&:hover::after': { transform: 'scaleX(1)' },
                    }}
                  >
                    {item.label}
                  </Button>
                ),
              )}
            </Stack>

            <Button
              component={RouterLink}
              to={PUBLIC_PATHS.conferences}
              variant="contained"
              color="secondary"
              size={scrolled ? 'small' : 'medium'}
              sx={{ display: { xs: 'none', md: 'inline-flex' }, whiteSpace: 'nowrap' }}
            >
              Explore conferences
            </Button>

            <IconButton
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation menu"
              sx={{ display: { xs: 'inline-flex', lg: 'none' }, ml: 1.5 }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>

        {isDesktop && (
          <Collapse in={megaOpen} timeout={{ enter: 260, exit: 160 }} unmountOnExit>
            <Box id="conferences-mega-menu" onMouseEnter={openMega} onMouseLeave={scheduleClose}>
              <MegaMenu onNavigate={() => setMegaOpen(false)} />
            </Box>
          </Collapse>
        )}
      </AppBar>

      <MobileNav open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
