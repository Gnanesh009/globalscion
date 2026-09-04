import { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Logo } from '@/components/common/Logo';
import { ADMIN_PATHS, PUBLIC_PATHS } from '@/constants';
import { useAuth } from '@/app/AuthProvider';
import { ADMIN_NAV } from './navConfig';

interface AdminSidebarProps {
  collapsed: boolean;
  onNavigate?: () => void;
}

export function AdminSidebar({ collapsed, onNavigate }: AdminSidebarProps) {
  const { pathname, search } = useLocation();
  const { hasRole } = useAuth();
  const [openGroups, setOpenGroups] = useState<string[]>([ADMIN_PATHS.conferences]);

  // Auto-open the group containing the active route.
  useEffect(() => {
    ADMIN_NAV.forEach((section) =>
      section.items.forEach((item) => {
        if (item.children && pathname.startsWith(item.href)) {
          setOpenGroups((prev) => (prev.includes(item.href) ? prev : [...prev, item.href]));
        }
      }),
    );
  }, [pathname]);

  const toggleGroup = (href: string) =>
    setOpenGroups((prev) => (prev.includes(href) ? prev.filter((item) => item !== href) : [...prev, href]));

  const isChildActive = (href: string) => {
    const [path, query] = href.split('?');
    if (pathname !== path) return false;
    return query ? search.includes(query) : !search.includes('status=');
  };

  return (
    <Stack sx={{ height: '100%', backgroundColor: '#0B1F3A', color: 'rgba(255,255,255,0.72)' }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent={collapsed ? 'center' : 'flex-start'}
        sx={{ height: 64, px: collapsed ? 0 : 2.5, flexShrink: 0 }}
      >
        <Box component={RouterLink} to={ADMIN_PATHS.dashboard} aria-label="Admin dashboard">
          {collapsed ? (
            <Box
              aria-hidden
              sx={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                background: 'linear-gradient(140deg, #14A2AE 0%, #0E7C86 100%)',
                color: '#0B1F3A',
                fontWeight: 800,
                fontSize: 14,
              }}
            >
              GS
            </Box>
          ) : (
            <Logo variant="light" compact />
          )}
        </Box>
      </Stack>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />

      <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', py: 1.5 }}>
        {ADMIN_NAV.map((section) => {
          const visibleItems = section.items.filter((item) => !item.roles || hasRole(item.roles));
          if (!visibleItems.length) return null;

          return (
            <Box key={section.heading} sx={{ mb: 1 }}>
              {!collapsed && (
                <Typography
                  variant="overline"
                  sx={{
                    display: 'block',
                    px: 2.5,
                    pt: 1.5,
                    pb: 0.75,
                    color: 'rgba(255,255,255,0.34)',
                    fontSize: '0.6875rem',
                  }}
                >
                  {section.heading}
                </Typography>
              )}

              <List disablePadding>
                {visibleItems.map((item) => {
                  const active = pathname.startsWith(item.href);
                  const expanded = openGroups.includes(item.href);

                  return (
                    <Box key={item.href}>
                      <Tooltip title={collapsed ? item.label : ''} placement="right" arrow>
                        <ListItemButton
                          {...(item.children
                            ? {}
                            : { component: RouterLink as never, to: item.href })}
                          onClick={() => {
                            if (item.children) toggleGroup(item.href);
                            else onNavigate?.();
                          }}
                          aria-current={active && !item.children ? 'page' : undefined}
                          aria-expanded={item.children ? expanded : undefined}
                          sx={{
                            mx: 1,
                            mb: 0.25,
                            borderRadius: 1.5,
                            minHeight: 42,
                            width: 'auto',
                            justifyContent: collapsed ? 'center' : 'flex-start',
                            px: collapsed ? 1 : 1.5,
                            color: active ? 'common.white' : 'rgba(255,255,255,0.68)',
                            backgroundColor: active ? 'rgba(37,99,235,0.22)' : 'transparent',
                            '&:hover': { backgroundColor: 'rgba(255,255,255,0.07)', color: 'common.white' },
                            '&:focus-visible': { outline: '2px solid', outlineColor: 'info.light', outlineOffset: -2 },
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: collapsed ? 0 : 34,
                              color: 'inherit',
                              '& svg': { fontSize: 20 },
                            }}
                          >
                            {item.icon}
                          </ListItemIcon>
                          {!collapsed && (
                            <>
                              <ListItemText
                                primary={item.label}
                                primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: active ? 700 : 500 }}
                              />
                              {item.children &&
                                (expanded ? (
                                  <ExpandLessIcon sx={{ fontSize: 18 }} />
                                ) : (
                                  <ExpandMoreIcon sx={{ fontSize: 18 }} />
                                ))}
                            </>
                          )}
                        </ListItemButton>
                      </Tooltip>

                      {item.children && !collapsed && (
                        <Collapse in={expanded} unmountOnExit>
                          <List disablePadding sx={{ pl: 4.5, pr: 1, pb: 0.5 }}>
                            {item.children.map((child) => (
                              <ListItemButton
                                key={child.href}
                                component={RouterLink}
                                to={child.href}
                                onClick={onNavigate}
                                sx={{
                                  borderRadius: 1.5,
                                  minHeight: 34,
                                  color: isChildActive(child.href) ? 'common.white' : 'rgba(255,255,255,0.55)',
                                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.06)', color: 'common.white' },
                                }}
                              >
                                <ListItemText
                                  primary={child.label}
                                  primaryTypographyProps={{
                                    fontSize: '0.8125rem',
                                    fontWeight: isChildActive(child.href) ? 700 : 500,
                                  }}
                                />
                              </ListItemButton>
                            ))}
                          </List>
                        </Collapse>
                      )}
                    </Box>
                  );
                })}
              </List>
            </Box>
          );
        })}
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
      <Box sx={{ p: collapsed ? 1 : 2 }}>
        {collapsed ? (
          <Tooltip title="View public site" placement="right" arrow>
            <IconButton
              component="a"
              href={PUBLIC_PATHS.home}
              target="_blank"
              rel="noopener"
              sx={{ color: 'rgba(255,255,255,0.6)', width: '100%' }}
            >
              <OpenInNewIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        ) : (
          <Stack
            component="a"
            href={PUBLIC_PATHS.home}
            target="_blank"
            rel="noopener"
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              px: 1.5,
              py: 1.25,
              borderRadius: 1.5,
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.72)',
              textDecoration: 'none',
              '&:hover': { borderColor: 'rgba(255,255,255,0.28)', color: 'common.white' },
            }}
          >
            <Box>
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700 }}>View public site</Typography>
              <Typography sx={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.42)' }}>
                globalscion.com
              </Typography>
            </Box>
            <OpenInNewIcon sx={{ fontSize: 15 }} />
          </Stack>
        )}
        {!collapsed && (
          <Chip
            size="small"
            label="CMS v1.0"
            sx={{
              mt: 1.5,
              width: '100%',
              backgroundColor: 'rgba(255,255,255,0.06)',
              color: 'rgba(255,255,255,0.4)',
              fontSize: '0.6875rem',
            }}
          />
        )}
      </Box>
    </Stack>
  );
}
