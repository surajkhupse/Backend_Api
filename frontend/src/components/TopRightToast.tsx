import Alert, { type AlertColor } from '@mui/material/Alert'
import Portal from '@mui/material/Portal'
import Snackbar from '@mui/material/Snackbar'
import Typography from '@mui/material/Typography'
import type { Theme } from '@mui/material/styles'
import type { PaletteColorNoChannels } from '../theme/core/palette'

export type TopRightToastProps = {
  open: boolean
  message: string
  severity?: AlertColor
  detail?: string
  onClose: () => void
  autoHideDuration?: number
}

function alertToastSx(severity: AlertColor) {
  return (theme: Theme) => {
    const palette = theme.palette[severity] as unknown as PaletteColorNoChannels
    return {
      width: 1,
      alignItems: 'flex-start',
      backgroundColor: palette.backgroundColorLight,
      color: theme.palette.text.primary,
      border: 1,
      borderStyle: 'solid',
      borderColor: palette.main,
      boxShadow: theme.vars.customShadows.card,
      '& .MuiAlert-icon': { color: palette.main },
      '& .MuiAlert-message': { width: 1 },
    }
  }
}

export function TopRightToast({
  open,
  message,
  severity = 'error',
  detail,
  onClose,
  autoHideDuration = 8000,
}: TopRightToastProps) {
  function handleSnackbarClose(_event: unknown, reason?: string) {
    if (reason === 'clickaway') {
      return
    }
    onClose()
  }

  return (
    <Portal>
      <Snackbar
        open={open}
        autoHideDuration={autoHideDuration}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          zIndex: (theme) => theme.zIndex.snackbar,
          top: { xs: 16, sm: 24 },
          right: { xs: 16, sm: 24 },
          left: { xs: 16, sm: 'auto' },
          maxWidth: { xs: 'calc(100% - 32px)', sm: 420 },
        }}
      >
        <Alert severity={severity} variant="outlined" onClose={onClose} sx={alertToastSx(severity)}>
          {message}
          {detail ? (
            <Typography variant="labelSm" component="div" sx={{ mt: 0.75, color: 'text.secondary' }}>
              {detail}
            </Typography>
          ) : null}
        </Alert>
      </Snackbar>
    </Portal>
  )
}
