import { useMemo } from 'react'
import { useAppSelector } from '../../../store/hooks'
import { getRoleFromAccessToken, isSuperadminRole, type UserRole } from '../utils/jwt'

export function useAuthRole(): UserRole | null {
  const role = useAppSelector((state) => state.auth.role)
  const accessToken = useAppSelector((state) => state.auth.tokens?.accessToken)
  return useMemo(
    () => role ?? getRoleFromAccessToken(accessToken),
    [role, accessToken],
  )
}

export function useIsSuperadmin(): boolean {
  const role = useAuthRole()
  return isSuperadminRole(role)
}
