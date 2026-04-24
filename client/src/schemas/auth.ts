import {  z } from 'zod'

export const loginSchema = z.object({
  email: z.email('Enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
})

export const signupSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, 'Username is required.')
    .max(30, 'Username must be 30 characters or fewer.'),
  email: z.email('Enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  confirmPassword: z.string().min(1,'Please confirm your password.'),
  first_name: z
    .string()
    .trim()
    .min(1, 'First name is required.')
    .max(20, 'First name should not be more than 20 characters.'),
  last_name: z
    .string()
    .trim()
    .min(1, 'Last name is required.')
    .max(20, 'Last name should not be more than 20 characters.'),
 isAgreed: z.literal(true,{message:'You must agree to terms and conditions.'})
}).refine((data)=> data.password===data.confirmPassword,{
  message:'The passwords do not match.',
  path:['confirmPassword']
})
export const emailSchema =z.object({ email: z.email('Enter a valid email address.')})
export const resetPasswordSchema = z.object({
  newPassword:z.string().min(8,'Password must be at least 8 characters.'),
  confirmPassword:z.string().min(8,'Password must be at least 8 characters.')
}).refine((data)=>data.newPassword === data.confirmPassword,{
  message:'The passwords do not match.',
  path:['confirmPassword']
})


export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>
export type EmailSchema = z.infer<typeof emailSchema >
export type LoginSchema = z.infer<typeof loginSchema>
export type SignupSchema = z.infer<typeof signupSchema>
