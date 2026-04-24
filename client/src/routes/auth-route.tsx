import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/hooks/redux'

export function AuthRoute({ children }: { children: React.ReactNode }) {
  const auth = useAppSelector((state) => state.auth)
  const location = useLocation()

  if (auth.status === 'authenticated') {
    return <Navigate to="/dashboard" replace state={{ from: location.pathname }} />
  }

  return <>{children}</>
}