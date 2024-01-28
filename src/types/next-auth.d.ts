// Ref: https://next-auth.js.org/getting-started/typescript#module-augmentation
import { DefaultSession, DefaultUser } from 'next-auth'
import { JWT, DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user?: {
      role?: string
      _id: string
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    role?: string
    _id: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    role?: string
    _id: string
  }
}
