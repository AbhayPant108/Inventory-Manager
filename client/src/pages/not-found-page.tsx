import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="max-w-lg space-y-5 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500 dark:text-stone-400">
          404
        </p>
        <h1 className="font-display text-5xl font-bold">Page not found.</h1>
        <p className="text-stone-600 dark:text-stone-300">
          The route you requested does not exist in this frontend workspace.
        </p>
        <Link to="/">
          <Button>Back to dashboard</Button>
        </Link>
      </Card>
    </div>
  )
}
