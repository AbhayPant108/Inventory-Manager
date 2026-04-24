import { RouterProvider } from 'react-router-dom'
import { ThemeController } from '@/components/ui/theme-controller'
import { Toaster } from '@/components/ui/toaster'
import { router } from '@/routes/router'

function App() {
  return (
    <>
      <ThemeController />
      <RouterProvider router={router} />
      <Toaster />
    </>
  )
}

export default App
