import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { emailSchema, resetPasswordSchema, type EmailSchema, type ResetPasswordSchema } from '@/schemas/auth'
import { PasswordStrengthBar } from '@/components/signup/password-strenght-bar'




interface EmailFormProps {
    isLoading?: boolean
    onSubmit: (values: EmailSchema) => Promise<void> | void
}
interface ResetPasswordFormProps {
    isLoading?: boolean
    onSubmit: (values: ResetPasswordSchema) => Promise<void> | void
}

export function EmailForm({ isLoading = false, onSubmit }: EmailFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<EmailSchema>({
        resolver: zodResolver(emailSchema),
        defaultValues: {
            email: ''
        }
    })

    return (
        <form className="flex flex-col gap-3" onSubmit={handleSubmit(async (values) => onSubmit(values))}>
            <Input label="Email" error={errors.email?.message} {...register('email')} />
            <div className="md:col-span-2 mt-4">
                <Button type="submit" className="w-full bg-linear-to-br from-amber-600 to-amber-500" isLoading={isLoading}>
                    {!isLoading ? 'Send Email' : 'Sending Email...'}
                </Button>
            </div>
        </form>
    )
}
export function ResetPasswordForm({ isLoading = false, onSubmit }: ResetPasswordFormProps) {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<ResetPasswordSchema>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            newPassword: '',
            confirmPassword:''
        }
    })
    const newPasswordValue = watch('newPassword')

    return (
        <form className="flex flex-col gap-3" onSubmit={handleSubmit(async (values) => onSubmit(values))}>
            <div>
                <Input
                    label="Password"
                    type="password"
                    error={errors.newPassword?.message}
                    {...register('newPassword')}
                />
                <PasswordStrengthBar password={newPasswordValue} />
            </div>

            <Input
                label="Confirm Password"
                type="password"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
            />
            <div className="md:col-span-2 mt-4">
                <Button type="submit" className="w-full bg-linear-to-br from-amber-600 to-amber-500" isLoading={isLoading}>
                    {!isLoading ? 'Reset' : 'Reseting...'}
                </Button>
            </div>
        </form>
    )
}

