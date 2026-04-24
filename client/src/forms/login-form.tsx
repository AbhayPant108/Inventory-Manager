import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { loginSchema, type LoginSchema} from '@/schemas/auth'
import { Link } from 'react-router-dom'



interface LoginFormProps {
  isLoading?: boolean
  onSubmit: (values: LoginSchema) => Promise<void> | void
}

export function LoginForm({ isLoading = false, onSubmit }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit(async (values) => onSubmit(values))}>
      <Input label="Email" error={errors.email?.message} {...register('email')} />
    

       <Input
        label="Password"
        type="password"
        error={errors.password?.message}
        {...register('password')}
      />
      <span className='text-xs text-amber-400 self-start hover:text-amber-400/70'><Link  to={'/forgot-password'}>Forgot Password?</Link></span>
        
      <div className="md:col-span-2 mt-4">
        <Button type="submit" className="w-full bg-linear-to-br from-amber-600 to-amber-500" isLoading={isLoading}>
          {!isLoading?'Sign In':'Signing in...'}
        </Button>
      </div>
    </form>
  )
}


