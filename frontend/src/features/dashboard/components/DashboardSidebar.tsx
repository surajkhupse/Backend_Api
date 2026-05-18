import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'
import { logoutRequest } from '../../auth'
import { ROUTES } from '../../../routes/paths'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { clearTokens } from '../../../store/slices/authSlice'
import { MaterialSymbol } from '../../../theme'
import { layout } from '../../../theme/tokens/spacing'
import { DASHBOARD_BRAND } from '../constants/dashboard'

const NAV_ITEMS = [
  { label: 'Dashboard', icon: 'dashboard', active: true },
  { label: 'Events', icon: 'calendar_today', active: false },
  { label: 'Sessions', icon: 'video_library', active: false },
  { label: 'Audit Logs', icon: 'receipt_long', active: false },
  { label: 'Settings', icon: 'settings', active: false },
] as const

const FOOTER_NAV = [
  { label: 'Profile', icon: 'account_circle', danger: false },
  { label: 'Log Out', icon: 'logout', danger: true },
] as const

export function DashboardSidebar() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const auth = useAppSelector((state) => state.auth)

  async function handleLogout() {
    const refreshToken = auth?.refreshToken
    if (refreshToken) {
      try {
        await logoutRequest(refreshToken)
      } catch {
        /* clear local session even if API fails */
      }
    }
    dispatch(clearTokens())
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
        {NAV_ITEMS.map((item) => (
          <ListItemButton
            key={item.label}
            selected={item.active}
            sx={{
              py: 1.5,
              px: 2,
              mb: 0.5,
              ...(item.active && {
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
                <Typography
                  variant="bodyMd"
                  sx={{ fontWeight: item.active ? 700 : 400 }}
                >
                  {item.label}
                </Typography>
              }
            />
          </ListItemButton>
        ))}
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
