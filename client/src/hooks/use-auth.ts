import { useMemo } from 'react'
import { clearUser, setUser } from '@/store/auth-slice'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import type { AuthUser } from '@/types/auth'

export function useAuth() {
  const dispatch = useAppDispatch()
  const auth = useAppSelector((state) => state.auth)

  return useMemo(
    () => ({
      ...auth,
      signIn(user:AuthUser ) {
        dispatch(setUser(user))
      },
      signOut() {
        dispatch(clearUser())
      },
    }),
    [auth, dispatch],
  )
}
