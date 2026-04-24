import { lazy, Suspense, type ReactNode } from 'react'
import { createBrowserRouter, Outlet } from 'react-router-dom'
import { AppLayout } from '@/components/layout/app-layout'
import { Card } from '@/components/ui/card'
import { ProtectedRoute } from '@/routes/protected-route'
import { SignupForm } from '@/forms/signup-form'
import { AuthRoute } from './auth-route'
const DashboardPage = lazy(async () => ({
  default: (await import('@/pages/dashboard-page')).DashboardPage,
}))
const ProductsPage = lazy(async () => ({
  default: (await import('@/pages/products-page')).ProductsPage,
}))
const CategoriesPage = lazy(async () => ({
  default: (await import('@/pages/categories-page')).CategoriesPage,
}))
const StoresPage = lazy(async () => ({
  default: (await import('@/pages/stores-page')).StoresPage,
}))
const InventoryPage = lazy(async () => ({
  default: (await import('@/pages/inventory-page')).InventoryPage,
}))
const SuppliersPage = lazy(async () => ({
  default: (await import('@/pages/suppliers-page')).SuppliersPage,
}))
const LoginPage = lazy(async () => ({
  default: (await import('@/pages/login-page')).LoginPage,
}))
const SignupPage = lazy(async () => ({
  default: (await import('@/pages/signup-page')).SignupPage,
}))
const ForgotPasswordPage = lazy(async () => ({
  default: (await import('@/pages/forgot-password-page')).ForgotPasswordPage,
}))
const ResetPasswordPage = lazy(async () => ({
  default: (await import('@/pages/reset-password-page')).ResetPasswordPage,
}))
const NotFoundPage = lazy(async () => ({
  default: (await import('@/pages/not-found-page')).NotFoundPage,
}))


function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <p className="font-display text-2xl font-semibold">Loading workspace...</p>
      </Card>
    </div>
  )
}

function withSuspense(element: ReactNode) {
  return <Suspense fallback={<RouteFallback />}>{element}</Suspense>
}

export const router = createBrowserRouter([
  {
    path:'/components',
    element:<Outlet />,
    children:[
      {path:'pgen',element:(<div className='box-border w-1/2 m-auto my-10 '>
        <SignupForm onSubmit={()=>{}}/>
      </div>)},
      {path:'',element:(<></>)}
    ]
  },
  {path:'/temp',
    element:<ForgotPasswordPage />
  },
  {
    path: '/',
    element: (
      <AuthRoute>
        <Outlet />
      </AuthRoute>
    ),
    children: [
      { path:'/forgot-password', element: withSuspense(<ForgotPasswordPage />) },
      { path:'/login', element: withSuspense(<LoginPage />) },
      { path:'/signup', element: withSuspense(<SignupPage />) },
      { path:'/reset-password', element: withSuspense(<ResetPasswordPage />) }
    ],
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { path:'',index: true, element: withSuspense(<DashboardPage />) },
      { path: 'products', element: withSuspense(<ProductsPage />) },
      { path: 'categories', element: withSuspense(<CategoriesPage />) },
      { path: 'stores', element: withSuspense(<StoresPage />) },
      { path: 'inventory', element: withSuspense(<InventoryPage />) },
      { path: 'suppliers', element: withSuspense(<SuppliersPage />) },
    ],
  },
  {
    path: '*',
    element: withSuspense(<NotFoundPage />),
  },
])
