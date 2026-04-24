import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/hooks/redux'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const auth = useAppSelector((state) => state.auth)
  const location = useLocation()
  console.log(auth.status);
  if (auth.status !== 'authenticated') {
    
    
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <>{children}</>
}
