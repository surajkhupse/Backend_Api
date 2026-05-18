import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import { useState } from 'react'
import { useThemeMode } from '../hooks/useThemeMode'
const OPTIONS: { value: 'light' | 'dark'; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]

/** Optional toolbar control for light / dark mode. */
export function ThemeModeToggle() {
  const { mode, setMode, toggleMode } = useThemeMode()
  const [anchor, setAnchor] = useState<null | HTMLElement>(null)

  const Icon = mode === 'dark' ? DarkModeOutlinedIcon : LightModeOutlinedIcon

  return (
    <>
      <Tooltip title="Theme (click to toggle, right-click for menu)">
        <IconButton
          size="small"
          onClick={toggleMode}
          onContextMenu={(e) => {
            e.preventDefault()
            setAnchor(e.currentTarget)
          }}
          aria-label="Toggle color mode"
        >
          <Icon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
        {OPTIONS.map((opt) => (
          <MenuItem
            key={opt.value}
            selected={mode === opt.value}
            onClick={() => {
              setMode(opt.value)
              setAnchor(null)
            }}
          >
            {opt.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}
