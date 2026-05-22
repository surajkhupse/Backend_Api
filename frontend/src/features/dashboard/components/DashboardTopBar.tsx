import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useLocation } from 'react-router-dom'
import { ROUTES } from '../../../routes/paths'
import { MaterialSymbol } from '../../../theme'
import { layout } from '../../../theme/tokens/spacing'
import { USER_AVATAR_URL } from '../constants/dashboard'

const CRUMBS: Record<string, { parent: string; current: string }> = {
  [ROUTES.HOME]: { parent: 'Home', current: 'Dashboard' },
  [ROUTES.AUDIT_LOGS]: { parent: 'Infrastructure', current: 'Audit Logs' },
}

export function DashboardTopBar() {
  const { pathname } = useLocation()
  const crumb = CRUMBS[pathname] ?? CRUMBS[ROUTES.HOME]
  const showTopSearch = pathname !== ROUTES.AUDIT_LOGS

  return (
    <Box
      component="header"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        height: layout.topbarHeight,
        px: { xs: 2, md: 3 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        borderBottom: 1,
        borderColor: 'border.subtle',
        bgcolor: (theme) =>
          theme.palette.mode === 'light'
            ? 'rgba(248, 249, 255, 0.7)'
            : 'rgba(17, 24, 39, 0.85)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
        <Typography variant="labelMd" color="text.secondary" noWrap>
          {crumb.parent}
        </Typography>
        <MaterialSymbol name="chevron_right" sx={{ fontSize: 16, color: 'text.secondary' }} />
        <Typography variant="labelMd" color="primary.main" sx={{ fontWeight: 700 }} noWrap>
          {crumb.current}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, md: 3 } }}>
        {showTopSearch ? (
          <TextField
            size="small"
            placeholder="Search events…"
            sx={{
              display: { xs: 'none', sm: 'block' },
              width: { sm: 256, md: 320 },
              '& .MuiOutlinedInput-root': {
                borderRadius: 9999,
                bgcolor: 'background.containerLow',
                fontSize: (theme) => theme.typography.bodySm.fontSize,
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <MaterialSymbol name="search" sx={{ fontSize: 20, color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        ) : null}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton size="small" aria-label="Help">
            <MaterialSymbol name="help" sx={{ color: 'text.secondary' }} />
          </IconButton>
          <IconButton size="small" aria-label="Notifications">
            <Badge
              variant="dot"
              color="error"
              overlap="circular"
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MaterialSymbol name="notifications" sx={{ color: 'text.secondary' }} />
            </Badge>
          </IconButton>
          <Avatar
            src={USER_AVATAR_URL}
            alt="User avatar"
            sx={{
              width: 32,
              height: 32,
              border: 1,
              borderColor: 'border.subtle',
              cursor: 'pointer',
            }}
          />
        </Box>
      </Box>
    </Box>
  )
}
