import { useEffect, useState } from 'react'
import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Paper from '@mui/material/Paper'
import type { SxProps, Theme } from '@mui/material/styles'
import Snackbar from '@mui/material/Snackbar'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useThemeMode } from '../../theme/hooks/useThemeMode'
import { MaterialSymbol } from '../../theme'
import { layout } from '../../theme/tokens/spacing'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  clearProfileError,
  clearProfileSaveSuccess,
  fetchMyProfile,
  profileToForm,
  saveMyProfile,
  type ProfileFormState,
} from '../../store/slices/profileSlice'
import { USER_AVATAR_URL } from '../dashboard/constants/dashboard'

const BIO_MAX = 250

const EMPTY_PROFILE_FORM: ProfileFormState = {
  name: '',
  jobTitle: '',
  bio: '',
  avatar: '',
  theme: 'light',
  publicProfile: true,
  usageData: false,
}

const SETTINGS_NAV = [
  { id: 'profile', label: 'Profile', icon: 'person' },
  { id: 'security', label: 'Security', icon: 'security', disabled: true },
  { id: 'team', label: 'Team', icon: 'group', disabled: true },
  { id: 'notifications', label: 'Notifications', icon: 'notifications_active', disabled: true },
  { id: 'billing', label: 'Billing', icon: 'payments', disabled: true },
] as const

function ThemeOptionCard({
  selected,
  title,
  description,
  icon,
  onClick,
}: {
  selected: boolean
  title: string
  description: string
  icon: string
  onClick: () => void
}) {
  return (
    <Paper
      component="button"
      type="button"
      onClick={onClick}
      elevation={0}
      sx={{
        p: 2,
        textAlign: 'left',
        cursor: 'pointer',
        border: 2,
        borderColor: selected ? 'primary.main' : 'border.subtle',
        bgcolor: selected ? 'background.paper' : 'background.containerLow',
        borderRadius: 3,
        boxShadow: selected ? (theme) => `0 0 0 4px ${theme.palette.primary.main}14` : 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        '&:hover': {
          borderColor: selected ? 'primary.main' : 'primary.light',
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: selected ? (theme) => `${theme.palette.primary.main}18` : 'background.container',
            color: selected ? 'primary.main' : 'text.secondary',
          }}
        >
          <MaterialSymbol name={icon} filled={selected} />
        </Box>
        <Box
          sx={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            border: 4,
            borderColor: selected ? 'primary.main' : 'border.subtle',
            bgcolor: selected ? 'primary.main' : 'transparent',
          }}
        />
      </Box>
      <Typography variant="labelMd" sx={{ fontWeight: 700, display: 'block' }}>
        {title}
      </Typography>
      <Typography variant="labelSm" color="text.secondary">
        {description}
      </Typography>
    </Paper>
  )
}

function PrivacyRow({
  icon,
  title,
  description,
  checked,
  onChange,
  iconColor = 'secondary.main',
  iconBoxSx,
}: {
  icon: string
  title: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
  iconColor?: string
  iconBoxSx?: SxProps<Theme>
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        border: 1,
        borderColor: 'border.subtle',
        borderRadius: 3,
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', minWidth: 0 }}>
        <Box
          sx={{
            p: 1,
            borderRadius: 2,
            color: iconColor,
            display: 'flex',
            ...iconBoxSx,
          }}
        >
          <MaterialSymbol name={icon} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="labelMd" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          <Typography variant="labelSm" color="text.secondary">
            {description}
          </Typography>
        </Box>
      </Box>
      <Switch checked={checked} onChange={(_, v) => onChange(v)} color="primary" />
    </Paper>
  )
}

export function ProfilePage() {
  const dispatch = useAppDispatch()
  const { data, loading, saving, error, saveSuccess } = useAppSelector((state) => state.profile)
  const { setMode } = useThemeMode()

  const [draft, setDraft] = useState<{
    sourceData: typeof data
    form: ProfileFormState
  }>({
    sourceData: null,
    form: EMPTY_PROFILE_FORM,
  })

  useEffect(() => {
    dispatch(fetchMyProfile())
  }, [dispatch])

  const form = data && draft.sourceData !== data ? profileToForm(data) : draft.form

  const avatarSrc = form.avatar.trim() || USER_AVATAR_URL
  const isDirty =
    data != null &&
    JSON.stringify(form) !== JSON.stringify(profileToForm(data))

  function patchForm(patch: Partial<ProfileFormState>) {
    setDraft((prev) => ({
      sourceData: data,
      form: {
        ...(data && prev.sourceData !== data ? profileToForm(data) : prev.form),
        ...patch,
      },
    }))
  }

  function handleDiscard() {
    setDraft({
      sourceData: data,
      form: data ? profileToForm(data) : EMPTY_PROFILE_FORM,
    })
  }

  function handleThemeSelect(theme: 'light' | 'dark') {
    patchForm({ theme })
    setMode(theme)
  }

  async function handleSave() {
    const result = await dispatch(
      saveMyProfile({
        name: form.name.trim(),
        jobTitle: form.jobTitle.trim(),
        bio: form.bio.trim().slice(0, BIO_MAX),
        avatar: form.avatar.trim(),
        theme: form.theme,
        publicProfile: form.publicProfile,
        usageData: form.usageData,
      }),
    )
    if (saveMyProfile.fulfilled.match(result)) {
      setMode(result.payload.theme === 'dark' ? 'dark' : 'light')
    }
  }

  if (loading && !data) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, py: 12 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        pb: 12,
        p: { xs: 2, md: 4 },
        width: 1,
        minWidth: 0,
      }}
    >
      <Box
        sx={{
          flex: 1,
          width: 1,
          maxWidth: 1000,
          mx: 'auto',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 220px) minmax(0, 1fr)' },
          columnGap: { xs: 0, md: 6 },
          rowGap: { xs: 3, md: 0 },
          alignItems: 'start',
        }}
      >
        <Box
          component="nav"
          aria-label="Settings sections"
          sx={{
            position: { md: 'sticky' },
            top: { md: layout.topbarHeight + 24 },
            alignSelf: 'start',
            width: 1,
            maxWidth: { md: 220 },
            m: 0,
            p: 0,
          }}
        >
          <List disablePadding sx={{ m: 0, p: 0 }}>
            {SETTINGS_NAV.map((item) => {
              const active = item.id === 'profile'
              const disabled = 'disabled' in item && item.disabled
              return (
                <ListItemButton
                  key={item.id}
                  selected={active}
                  disabled={disabled}
                  sx={{
                    px: 1.5,
                    py: 1,
                    mb: 0.5,
                    borderRadius: 2,
                    gap: 1.5,
                    color: active ? 'primary.main' : 'text.secondary',
                    bgcolor: active ? (theme) => `${theme.palette.primary.main}0D` : 'transparent',
                    '&.Mui-selected': {
                      bgcolor: (theme) => `${theme.palette.primary.main}0D`,
                      color: 'primary.main',
                      '&:hover': {
                        bgcolor: (theme) => `${theme.palette.primary.main}14`,
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 0, mr: 0, color: 'inherit' }}>
                    <MaterialSymbol name={item.icon} sx={{ fontSize: 22 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    slotProps={{
                      primary: {
                        variant: 'labelMd',
                        sx: { fontWeight: active ? 700 : 500 },
                      },
                    }}
                  />
                </ListItemButton>
              )
            })}
          </List>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
          <Box>
            <Typography variant="headlineLg" sx={{ fontWeight: 600 }}>
              Profile Settings
            </Typography>
            <Typography variant="bodyMd" color="text.secondary" sx={{ mt: 1 }}>
              Manage your personal information and how you appear to your team members.
            </Typography>
          </Box>

          {error ? (
            <Alert severity="error" onClose={() => dispatch(clearProfileError())}>
              {error}
            </Alert>
          ) : null}

          {data?.email ? (
            <Typography variant="labelSm" color="text.secondary">
              Signed in as {data.email}
            </Typography>
          ) : null}

          <Box component="section" sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 4 }}>
              <Box sx={{ position: 'relative', '&:hover .avatar-overlay': { opacity: 1 } }}>
                <Avatar
                  src={avatarSrc}
                  alt="Profile avatar"
                  sx={{
                    width: 96,
                    height: 96,
                    border: 4,
                    borderColor: 'background.paper',
                    boxShadow: 1,
                  }}
                />
                <Box
                  className="avatar-overlay"
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    bgcolor: 'rgba(11, 28, 48, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.2s',
                  }}
                >
                  <MaterialSymbol name="photo_camera" sx={{ color: 'common.white' }} />
                </Box>
              </Box>
              <Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      const url = window.prompt('Paste image URL for your avatar')
                      if (url != null) patchForm({ avatar: url.trim() })
                    }}
                  >
                    Upload new photo
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => patchForm({ avatar: '' })}
                  >
                    Remove
                  </Button>
                </Box>
                <Typography variant="labelSm" color="text.secondary" sx={{ mt: 1 }}>
                  JPG, GIF or PNG. Max size of 800K (URL for now)
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 3,
              }}
            >
              <TextField
                label="Display Name"
                value={form.name}
                onChange={(e) => patchForm({ name: e.target.value })}
                slotProps={{ htmlInput: { maxLength: 100 } }}
                fullWidth
              />
              <TextField
                label="Job Title"
                value={form.jobTitle}
                onChange={(e) => patchForm({ jobTitle: e.target.value })}
                slotProps={{ htmlInput: { maxLength: 100 } }}
                fullWidth
              />
              <TextField
                label="Bio"
                value={form.bio}
                onChange={(e) => patchForm({ bio: e.target.value.slice(0, BIO_MAX) })}
                multiline
                minRows={4}
                fullWidth
                sx={{ gridColumn: { sm: '1 / -1' } }}
                helperText={`${form.bio.length} / ${BIO_MAX} characters`}
              />
            </Box>
          </Box>

          <Divider />

          <Box component="section" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
              <Typography variant="headlineMd" sx={{ fontWeight: 600 }}>
                Interface Theme
              </Typography>
              <Typography variant="bodyMd" color="text.secondary" sx={{ mt: 0.5 }}>
                Choose how EventPro looks for you.
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 2,
              }}
            >
              <ThemeOptionCard
                selected={form.theme === 'light'}
                title="Light"
                description="The default crisp interface."
                icon="light_mode"
                onClick={() => handleThemeSelect('light')}
              />
              <ThemeOptionCard
                selected={form.theme === 'dark'}
                title="Dark"
                description="Easy on the eyes in low light."
                icon="dark_mode"
                onClick={() => handleThemeSelect('dark')}
              />
            </Box>
          </Box>

          <Divider />

          <Box component="section" sx={{ display: 'flex', flexDirection: 'column', gap: 3, pb: 4 }}>
            <Box>
              <Typography variant="headlineMd" sx={{ fontWeight: 600 }}>
                Discovery &amp; Privacy
              </Typography>
              <Typography variant="bodyMd" color="text.secondary" sx={{ mt: 0.5 }}>
                Control who can see your profile and activity.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <PrivacyRow
                icon="visibility"
                title="Public Profile"
                description="Allow team members from other orgs to see your profile."
                checked={form.publicProfile}
                onChange={(publicProfile) => patchForm({ publicProfile })}
                iconColor="secondary.main"
                iconBoxSx={{ bgcolor: (theme) => `${theme.palette.secondary.main}22` }}
              />
              <PrivacyRow
                icon="analytics"
                title="Usage Data"
                description="Help us improve by sharing anonymized activity logs."
                checked={form.usageData}
                onChange={(usageData) => patchForm({ usageData })}
                iconColor="warning.dark"
                iconBoxSx={{ bgcolor: (theme) => `${theme.palette.warning.main}22` }}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        component="footer"
        sx={(theme) => ({
          position: 'fixed',
          bottom: 0,
          left: { xs: 0, md: layout.sidebarWidth },
          right: 0,
          zIndex: 40,
          py: 2,
          px: { xs: 2, md: 4 },
          borderTop: 1,
          borderColor: 'border.subtle',
          ...theme.mixins.glassSurface(theme, { blur: 16, bgOpacity: 0.88, borderOpacity: 0 }),
          boxShadow: theme.vars.customShadows.glass,
        })}
      >
        <Box
          sx={{
            width: 1,
            maxWidth: 1000,
            mx: 'auto',
            pl: { md: 0 },
            pr: { md: 0 },
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { sm: 'center' },
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
            <MaterialSymbol name="info" sx={{ fontSize: 18 }} />
            <Typography variant="labelSm">
              Changes will be applied across all active workspaces.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
            <Button
              variant="text"
              onClick={handleDiscard}
              disabled={saving || !isDirty}
              sx={{ fontWeight: 700 }}
            >
              Discard changes
            </Button>
            <Button
              variant="contained"
              onClick={() => void handleSave()}
              disabled={saving || !isDirty}
              sx={{
                px: 4,
                fontWeight: 700,
                borderRadius: 3,
                boxShadow: (theme) => `0 8px 24px ${theme.palette.primary.main}33`,
              }}
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </Button>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={saveSuccess}
        autoHideDuration={4000}
        onClose={() => dispatch(clearProfileSaveSuccess())}
        message="Profile saved successfully"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        sx={{ mb: 10 }}
      />
    </Box>
  )
}
