import { useAppDispatch } from '@/hooks/redux'
import api from '@/services/api/client'
import {normalizeApiError } from '@/services/api/error'
import { clearUser, setUser } from '@/store/auth-slice'
import type {  AuthUser, LoginCredentials, ResetPasswordPayload, SendEmailPayload, SignupPayload } from '@/types/auth'

/**
 * Returns the password strength level (0–4) and a label.
 * ADDED: Simple heuristic — checks length, uppercase, numbers, symbols.
 */
export function getPasswordStrength(password:string) {
  if (!password) return { level: 0, label: '' }
  let score = 0
  if (password.length >= 8)  score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const colors = ['', 'bg-red-500', 'bg-amber-500', 'bg-yellow-400', 'bg-emerald-500']
  return { level: score, label: labels[score], color: colors[score] }
}
function extractUser(payload: any, fallbackEmail: string) {
  const user = payload?.user ?? payload?.results?.user

  if (user) {
    return user as AuthUser
  }

  return {
    username: fallbackEmail.split('@')[0],
    email: fallbackEmail,
    is_authenticated:false
  } satisfies AuthUser
}
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
export const authService = {
  
  async register(payload: SignupPayload) {
    try {
      const response = await api.post('/auth/register', {
        ...payload,
      })

      return response.data
    } catch (error) {
      throw normalizeApiError(error)
    }
  },

  async login(payload: LoginCredentials): Promise<AuthUser> {
 
    try {
      const response = await api.post('/auth/login', payload,{withCredentials:true})
      
      if (!response) {
        throw new Error(
          'The backend login endpoint did not return a JWT token. The frontend is ready for token auth, but the backend login flow still needs completion.',
        )
      }
      
      return extractUser(response.data, payload.email) as AuthUser
      
    } catch (error) {
      throw normalizeApiError(error)
    }
  },
  async logout(){
  
  try {
    const response = await api.get('/auth/login')

    if(!response) throw new Error('Log out unsuccessfull.')
    
  } catch (error) {
    throw normalizeApiError(error)
  }    
  },
  async sendEmail(payload:SendEmailPayload){
     try {
    
    const response =  await api.post('/auth/send-email',payload)
    if(!response) throw new Error('Some Error occured while sending email.')
    return response.data
    
  } catch (error) {
    throw normalizeApiError(error)
  } 
  },
   async resetPassword(payload:ResetPasswordPayload){
     try {
    const response = await api.post('/auth/reset-password',payload)

    if(!response) throw new Error('Some error occured while reseting the password.')
    return response.data
  } catch (error) {
    throw normalizeApiError(error)
  } 
  }
}
