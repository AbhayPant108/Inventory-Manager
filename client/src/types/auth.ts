export interface AuthUser {
  id?: string
  username: string
  email: string
  first_name?: string
  last_name?: string
  avatar?: string
  is_staff?: boolean
  full_name?: string,
  is_authenticated:boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupPayload {
  username: string
  email: string
  password: string
  first_name: string
  last_name: string
}
export interface SendEmailPayload {
  email:string
}
export interface ResetPasswordPayload {
  newPassword:string,
  uid:string,
  token:string
}
export interface AuthSession {
  user: AuthUser
}
