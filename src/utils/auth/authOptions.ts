import { AuthOptions } from 'next-auth'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import clientPromise from '@/utils/mongodb'
import { authorize } from '@/utils/auth/authorize'

export const adapter = MongoDBAdapter(clientPromise)

export const authOptions: AuthOptions = {
  adapter: adapter,
  providers: [
    CredentialsProvider({
      id: 'googleonetap',
      name: 'google-one-tap',
      credentials: {
        credential: { type: 'text' },
      },
      authorize,
    }),
  ],
  debug: true, // TODO - disable debug on production
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token._id = user._id
      }
      return token
    },
    session({ session, token }) {
      session.user = {
        ...session.user,
        role: token.role,
        _id: token._id,
      }
      return session
    },
  },
}
