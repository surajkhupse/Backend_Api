import { useMemo } from 'react'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { MaterialSymbol } from '../../theme'

type Rule = {
  key: string
  label: string
  test: (pw: string) => boolean
}

const RULES: Rule[] = [
  { key: 'minLength', label: 'At least 8 characters', test: (pw) => pw.length >= 8 },
  { key: 'uppercase', label: 'One uppercase letter (A–Z)', test: (pw) => /[A-Z]/.test(pw) },
  { key: 'lowercase', label: 'One lowercase letter (a–z)', test: (pw) => /[a-z]/.test(pw) },
  { key: 'number', label: 'One number (0–9)', test: (pw) => /\d/.test(pw) },
  { key: 'special', label: 'One special character (!@#$%...)', test: (pw) => /[^a-zA-Z0-9]/.test(pw) },
]

function getStrength(password: string) {
  if (!password) return { score: 0, label: 'Enter a password', color: 'text.disabled' as const }

  const passed = RULES.filter((r) => r.test(password)).length
  const ratio = passed / RULES.length

  if (ratio <= 0.4) return { score: ratio * 100, label: 'Weak', color: 'error.main' as const }
  if (ratio <= 0.6) return { score: ratio * 100, label: 'Fair', color: 'warning.main' as const }
  if (ratio <= 0.8) return { score: ratio * 100, label: 'Good', color: 'info.main' as const }
  return { score: 100, label: 'Strong', color: 'success.main' as const }
}

export type PasswordValidationProps = {
  password: string
}

export function PasswordValidation({ password }: PasswordValidationProps) {
  const strength = useMemo(() => getStrength(password), [password])
  const results = useMemo(() => RULES.map((r) => ({ ...r, passed: r.test(password) })), [password])

  if (!password) return null

  return (
    <Box sx={{ mt: 1.5 }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.75 }}>
        <Typography variant="labelSm" sx={{ fontWeight: 600, color: 'text.secondary' }}>
          Password strength:
        </Typography>
        <Typography variant="labelSm" sx={{ fontWeight: 700, color: strength.color }}>
          {strength.label}
        </Typography>
      </Stack>

      <LinearProgress
        variant="determinate"
        value={strength.score}
        sx={{
          height: 6,
          borderRadius: 3,
          bgcolor: 'action.hover',
          mb: 1.5,
          '& .MuiLinearProgress-bar': {
            borderRadius: 3,
            bgcolor: strength.color,
            transition: 'transform 0.3s ease, background-color 0.3s ease',
          },
        }}
      />

      <Stack spacing={0.5}>
        {results.map((rule) => (
          <Stack key={rule.key} direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <MaterialSymbol
              name={rule.passed ? 'check_circle' : 'cancel'}
              sx={{
                fontSize: 16,
                color: rule.passed ? 'success.main' : 'text.disabled',
                transition: 'color 0.2s ease',
              }}
            />
            <Typography
              variant="labelSm"
              sx={{
                color: rule.passed ? 'text.primary' : 'text.disabled',
                transition: 'color 0.2s ease',
              }}
            >
              {rule.label}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  )
}
