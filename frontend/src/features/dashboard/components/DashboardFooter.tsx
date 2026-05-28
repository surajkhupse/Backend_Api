import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'

const FOOTER_LINKS = ['System Status', 'Privacy Policy', 'Documentation'] as const

export function DashboardFooter() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: 4,
        px: { xs: 2, md: 4 },
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderTop: 1,
        borderColor: 'border.subtle',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
        justifyContent: 'space-between',
        gap: 2,
      }}
    >
      <Typography variant="labelSm" color="text.secondary">
        © 2024 EventPro Enterprise Systems. All rights reserved.
      </Typography>
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {FOOTER_LINKS.map((label) => (
          <Link
            key={label}
            href="#"
            underline="none"
            variant="labelSm"
            color="text.secondary"
            onClick={(e) => e.preventDefault()}
            sx={{ '&:hover': { color: 'primary.main' } }}
          >
            {label}
          </Link>
        ))}
      </Box>
    </Box>
  )
}
