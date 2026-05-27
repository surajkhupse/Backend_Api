import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import { useLocation, useNavigate } from 'react-router-dom'
import { useIsSuperadmin } from '../../../features/auth/hooks/useAuthRole'
import { ROUTES } from '../../../routes/paths'
import { useAppDispatch } from '../../../store/hooks'
import { logout } from '../../../store/slices/authSlice'
import { MaterialSymbol } from '../../../theme'
import { layout } from '../../../theme/tokens/spacing'
import { DASHBOARD_BRAND } from '../constants/dashboard'

const TENANT_NAV_ITEMS = [
  { label: 'Dashboard', icon: 'dashboard', path: ROUTES.TENANT_DASHBOARD },
  { label: 'Events', icon: 'calendar_today', path: null },
  { label: 'Sessions', icon: 'video_library', path: null },
  { label: 'Audit Logs', icon: 'receipt_long', path: ROUTES.AUDIT_LOGS },
  { label: 'Settings', icon: 'settings', path: null },
] as const

const ADMIN_NAV_ITEMS = [
  { label: 'Dashboard', icon: 'admin_panel_settings', path: ROUTES.ADMIN_DASHBOARD },
  { label: 'Tenants', icon: 'domain', path: ROUTES.TENANTS },
  { label: 'Users', icon: 'group', path: ROUTES.USERS },
  { label: 'Audit Logs', icon: 'receipt_long', path: ROUTES.AUDIT_LOGS },
  { label: 'Settings', icon: 'settings', path: null },
] as const

const FOOTER_NAV = [
  { label: 'Profile', icon: 'account_circle', danger: false },
  { label: 'Log Out', icon: 'logout', danger: true },
] as const

export function DashboardSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const isSuperadmin = useIsSuperadmin()
  const navItems = isSuperadmin ? ADMIN_NAV_ITEMS : TENANT_NAV_ITEMS
  async function handleLogout() {
    await dispatch(logout())
    navigate(ROUTES.LOGIN, { replace: true })
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: layout.sidebarWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: layout.sidebarWidth,
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
          borderRight: 1,
          borderColor: 'border.subtle',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="headlineMd" color="primary.main" sx={{ fontWeight: 700 }}>
          {DASHBOARD_BRAND.productName}
        </Typography>
        <Typography variant="labelSm" color="text.secondary">
          {DASHBOARD_BRAND.tierLabel}
        </Typography>
      </Box>

      <List sx={{ flex: 1, px: 1.5, py: 0 }}>
        {navItems.map((item) => {
          const active = item.path != null && location.pathname === item.path
          return (
            <ListItemButton
              key={item.label}
              selected={active}
              disabled={item.path == null}
              onClick={item.path != null ? () => navigate(item.path!) : undefined}
              sx={{
                py: 1.5,
                px: 2,
                mb: 0.5,
                ...(active && {
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 4,
                    height: 24,
                    borderRadius: '0 4px 4px 0',
                    bgcolor: 'primary.main',
                  },
                }),
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <MaterialSymbol name={item.icon} sx={{ fontSize: 22 }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="bodyMd" sx={{ fontWeight: active ? 700 : 400 }}>
                    {item.label}
                  </Typography>
                }
              />
            </ListItemButton>
          )
        })}
      </List>

      <Divider sx={{ mx: 1.5 }} />

      <List sx={{ px: 1.5, py: 1 }}>
        {FOOTER_NAV.map((item) => (
          <ListItemButton
            key={item.label}
            onClick={item.danger ? () => void handleLogout() : undefined}
            sx={{
              py: 1.5,
              px: 2,
              borderRadius: 2,
              ...(item.danger && {
                '&:hover': {
                  color: 'error.main',
                  bgcolor: (theme) => `${theme.palette.error.main}14`,
                },
              }),
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
              <MaterialSymbol name={item.icon} sx={{ fontSize: 22 }} />
            </ListItemIcon>
            <ListItemText primary={<Typography variant="bodyMd">{item.label}</Typography>} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  )
}
