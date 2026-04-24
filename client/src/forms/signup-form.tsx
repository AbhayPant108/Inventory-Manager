import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { signupSchema, type SignupSchema } from '@/schemas/auth'
import { PasswordStrengthBar } from '@/components/signup/password-strenght-bar'
import { Link } from 'react-router-dom'


interface SignupFormProps {
  isLoading?: boolean
  onSubmit: (values: SignupSchema) => Promise<void> | void
}

export function SignupForm({ isLoading = false, onSubmit }: SignupFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      first_name: '',
      confirmPassword:'',
      last_name: '',
    },
  })
  const passwordValue = watch('password')

  return (
    <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(async (values) => onSubmit(values))}>
      <Input label="Username" autoComplete='off' error={errors.username?.message} {...register('username')} />
      <Input label="Email" error={errors.email?.message} {...register('email')} />
      <Input
        label="First Name"
        error={errors.first_name?.message}
        {...register('first_name')}
      />
      <Input label="Last Name" error={errors.last_name?.message} {...register('last_name')} />
      <div>
        <Input
        label="Password"
        type="password"
        error={errors.password?.message }
        {...register('password')}
      />
      <PasswordStrengthBar password={passwordValue}/>
      </div>

       <Input
        label="Confirm Password"
        type="password"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />
      <div>
      <span className='flex gap-2 items-center text-xs'>
        <Input
        type='checkbox'
        {...register('isAgreed')} />
        <p> I agree to all <Link to='/terms' className="font-semibold text-amber-400 hover:text-amber-300 transition-colors">
        Terms & Conditions</Link> </p>
        </span>
        {errors.isAgreed?.message ? <p className="text-xs text-rose-600">{errors.isAgreed.message}</p> : null}
        </div>
        
      <div className="md:col-span-2">
        <Button type="submit" className="w-full bg-linear-to-br from-amber-600 to-amber-500" isLoading={isLoading}>
          {!isLoading?'Create Account':'Creating account...'}
        </Button>
      </div>
    </form>
  )
}


