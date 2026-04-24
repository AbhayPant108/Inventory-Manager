import { addToast, removeToast } from '@/store/ui-slice'
import { useAppDispatch } from '@/hooks/redux'

export function useToast() {
  const dispatch = useAppDispatch()

  return {
    success(title: string, description?: string) {
      dispatch(addToast({ title, description, variant: 'success' }))
    },
    error(title: string, description?: string) {
      dispatch(addToast({ title, description, variant: 'error' }))
    },
    info(title: string, description?: string) {
      dispatch(addToast({ title, description, variant: 'info' }))
    },
    dismiss(id: string) {
      dispatch(removeToast(id))
    },
  }
}
