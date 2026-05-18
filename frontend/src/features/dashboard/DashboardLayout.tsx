import Box from '@mui/material/Box'
import { Outlet } from 'react-router-dom'
import {
  DashboardFab,
  DashboardFooter,
  DashboardSidebar,
  DashboardTopBar,
} from './components'

export function DashboardLayout() {
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary',
        overflowX: 'hidden',
        typography: 'bodyMd',
      }}
    >
      <DashboardSidebar />

      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          minWidth: 0,
        }}
      >
        <DashboardTopBar />
        <Outlet />
        <DashboardFooter />
      </Box>

      <DashboardFab />
    </Box>
  )
}
