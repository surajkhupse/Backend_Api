import type { SxProps, Theme } from '@mui/material/styles'
import { authMeshBackground } from '../globalStyles'
import { elevation } from '../tokens/elevation'
import { layout } from '../tokens/spacing'
import { radius } from '../tokens/radius'

export const authPageSx: SxProps<Theme> = (theme) => ({
  ...authMeshBackground(theme.palette.mode),
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  p: {
    xs: `${layout.gutterMobile}px`,
    md: `${layout.gutterDesktop}px`,
  },
})

export const authMainSx: SxProps<Theme> = {
  width: '100%',
  maxWidth: layout.loginMaxWidth,
  animation: 'auth-fade-in 0.4s ease-out',
}

export const authBrandBlockSx: SxProps<Theme> = {
  textAlign: 'center',
  mb: 5,
}

export const authBrandIconSx: SxProps<Theme> = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: layout.brandIconSize,
  height: layout.brandIconSize,
  borderRadius: `${radius.lg}px`,
  bgcolor: 'primary.main',
  color: 'primary.contrastText',
  boxShadow: elevation.lg,
  mb: 3,
}

export const authCardSx: SxProps<Theme> = {
  bgcolor: 'surface.containerLowest',
  border: 1,
  borderColor: 'border.subtle',
  borderRadius: `${radius.lg}px`,
  p: `${layout.authCardPadding}px`,
  boxShadow: elevation.authCard,
  backdropFilter: 'blur(4px)',
}

export const authFooterTextSx: SxProps<Theme> = {
  textAlign: 'center',
  mt: 4,
}

export const authStatusRowSx: SxProps<Theme> = {
  mt: 6,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 3,
  flexWrap: 'wrap',
}

export const authStatusDotSx: SxProps<Theme> = {
  width: 8,
  height: 8,
  borderRadius: radius.full,
  bgcolor: 'secondary.light',
}

export const supportFabSx: SxProps<Theme> = {
  position: 'fixed',
  bottom: layout.gutterDesktop,
  right: layout.gutterDesktop,
  display: { xs: 'none', md: 'flex' },
  alignItems: 'center',
  gap: 1,
  bgcolor: 'surface.containerLowest',
  border: 1,
  borderColor: 'border.subtle',
  px: 2,
  py: 1,
  borderRadius: radius.full,
  boxShadow: elevation.fab,
  cursor: 'pointer',
  color: 'text.secondary',
  transition: 'background-color 0.2s ease',
  '&:hover': { bgcolor: 'surface.containerLow' },
}

export const googleSignInButtonSx: SxProps<Theme> = {
  py: 1.5,
  px: 2,
  gap: 1.5,
  borderColor: 'border.subtle',
  color: 'text.secondary',
  fontWeight: 500,
  '&:hover': {
    borderColor: 'border.subtle',
    bgcolor: 'surface.containerLow',
  },
  '&:focus-visible': {
    outline: 'none',
    boxShadow: (t) => `0 0 0 2px ${t.palette.primary.main}33`,
  },
}

export const authSubmitButtonSx: SxProps<Theme> = {
  py: 2,
  fontWeight: 700,
}

export const authFormSpacing = 3

export const authLinkSx: SxProps<Theme> = {
  fontWeight: 700,
  textDecoration: 'none',
  color: 'primary.main',
  transition: 'color 0.2s ease',
  '&:hover': { color: 'primary.dark' },
}

export const authLinkSubtleSx: SxProps<Theme> = {
  fontWeight: 500,
  textDecoration: 'none',
  color: 'primary.main',
  transition: 'color 0.2s ease',
  '&:hover': { color: 'primary.dark' },
}

export const dividerWithLabelSx: SxProps<Theme> = {
  my: 4,
  '&::before, &::after': {
    borderColor: 'border.subtle',
  },
}

export const dividerLabelSx: SxProps<Theme> = {
  bgcolor: 'surface.containerLowest',
  px: 2,
  color: 'text.disabled',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
}
