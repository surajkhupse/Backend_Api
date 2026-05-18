import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { useThemeMode } from '../hooks/useThemeMode'

/** Compact theme toggle for topbars and auth screens. */
export function ThemeModeToggle() {
  const { mode, toggleMode } = useThemeMode()
  const Icon = mode === 'dark' ? DarkModeOutlinedIcon : LightModeOutlinedIcon

  return (
    <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
      <IconButton
        size="small"
        onClick={toggleMode}
        aria-label="Toggle color mode"
        sx={(theme) => ({
          ...theme.mixins.glassSurface(theme, { blur: 8, bgOpacity: 0.5 }),
        })}
      >
        <Icon fontSize="small" />
      </IconButton>
    </Tooltip>
  )
}
