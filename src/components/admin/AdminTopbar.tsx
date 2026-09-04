import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { useAuth } from '@/app/AuthProvider';
import { ADMIN_PATHS, USER_ROLE_OPTIONS } from '@/constants';
import { initialsOf } from '@/utils/format';

interface AdminTopbarProps {
  collapsed: boolean;
  onToggleSidebar: () => void;
  onOpenMobileNav: () => void;
  pendingCount?: number;
}

export function AdminTopbar({ collapsed, onToggleSidebar, onOpenMobileNav, pendingCount = 0 }: AdminTopbarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const roleLabel = USER_ROLE_OPTIONS.find((option) => option.value === user?.role)?.label ?? '';

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="inherit"
      sx={{
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        zIndex: (theme) => theme.zIndex.drawer - 1,
      }}
    >
      <Toolbar sx={{ minHeight: 64, gap: 1.5, px: { xs: 2, md: 3 } }}>
        <IconButton
          onClick={onToggleSidebar}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          sx={{ display: { xs: 'none', lg: 'inline-flex' } }}
        >
          {collapsed ? <MenuIcon /> : <MenuOpenIcon />}
        </IconButton>

        <IconButton
          onClick={onOpenMobileNav}
          aria-label="Open navigation"
          sx={{ display: { xs: 'inline-flex', lg: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ flex: 1 }} />

        <Button
          component={RouterLink}
          to={ADMIN_PATHS.conferenceNew}
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
        >
          New conference
        </Button>

        <Tooltip title="Pending submissions">
          <IconButton
            component={RouterLink}
            to={ADMIN_PATHS.abstracts}
            aria-label={`${pendingCount} pending submissions`}
          >
            <Badge badgeContent={pendingCount} color="error" max={99}>
              <NotificationsNoneIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem sx={{ my: 1.5, display: { xs: 'none', sm: 'block' } }} />

        <Stack
          direction="row"
          spacing={1.25}
          alignItems="center"
          onClick={(event) => setAnchor(event.currentTarget)}
          component="button"
          aria-haspopup="menu"
          aria-expanded={Boolean(anchor)}
          sx={{
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            px: 0.75,
            py: 0.5,
            borderRadius: 1.5,
            '&:hover': { backgroundColor: 'grey.100' },
          }}
        >
          <Avatar src={user?.avatar ?? undefined} sx={{ width: 34, height: 34, fontSize: '0.8125rem' }}>
            {initialsOf(`${user?.first_name ?? ''} ${user?.last_name ?? ''}`)}
          </Avatar>
          <Box sx={{ textAlign: 'left', display: { xs: 'none', md: 'block' } }}>
            <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, lineHeight: 1.2 }}>
              {user?.first_name} {user?.last_name}
            </Typography>
            <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary' }}>{roleLabel}</Typography>
          </Box>
        </Stack>

        <Menu
          anchorEl={anchor}
          open={Boolean(anchor)}
          onClose={() => setAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          slotProps={{ paper: { sx: { width: 240 } } }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 700 }}>
              {user?.first_name} {user?.last_name}
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{user?.email}</Typography>
            <Chip size="small" label={roleLabel} sx={{ mt: 1, fontSize: '0.6875rem' }} />
          </Box>
          <Divider />
          <MenuItem onClick={() => setAnchor(null)}>
            <ListItemIcon>
              <PersonOutlineIcon fontSize="small" />
            </ListItemIcon>
            My profile
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAnchor(null);
              navigate(ADMIN_PATHS.settings);
            }}
          >
            <ListItemIcon>
              <SettingsOutlinedIcon fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={() => {
              setAnchor(null);
              logout();
              navigate(ADMIN_PATHS.login);
            }}
            sx={{ color: 'error.main' }}
          >
            <ListItemIcon>
              <LogoutIcon fontSize="small" color="error" />
            </ListItemIcon>
            Sign out
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
