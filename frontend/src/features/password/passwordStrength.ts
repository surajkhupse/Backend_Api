export type PasswordStrength = {
  score: 0 | 1 | 2 | 3 | 4
  label: string
}

export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return { score: 0, label: 'Min. 8 characters' }
  }

  let points = 0
  if (password.length >= 8) points += 1
  if (password.length >= 12) points += 1
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) points += 1
  if (/[0-9]/.test(password)) points += 1
  if (/[^a-zA-Z0-9]/.test(password)) points += 1

  const score = Math.min(4, Math.max(1, points)) as 1 | 2 | 3 | 4

  if (password.length < 8) {
    return { score: Math.min(score, 2) as PasswordStrength['score'], label: 'Too short' }
  }
  if (score <= 2) return { score, label: 'Fair password' }
  if (score === 3) return { score, label: 'Good password' }
  return { score: 4, label: 'Strong password' }
}
