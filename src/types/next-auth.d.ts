// Ref: https://next-auth.js.org/getting-started/typescript#module-augmentation
import { DefaultSession, DefaultUser } from 'next-auth'
import { JWT, DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user?: {
      id: string
      role?: string
      phoneNumber: string
      userName: string
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    id: string
    role?: string
    phoneNumber: string
    userName: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string
    role?: string
    phoneNumber: string
    userName: string
  }
}
