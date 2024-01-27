import { AuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import GithubProvider, { GithubProfile } from 'next-auth/providers/github'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID!,
    //   clientSecret: process.env.GITHUB_SECRET!,
    //   profile(profile: GithubProfile) {
    //     return {
    //       id: profile.id.toString(),
    //       name: profile.name,
    //       email: profile.email,
    //       image: profile.avatar_url,
    //       // role: '',
    //     }
    //   },
    // }),
  ],
  debug: true, // TODO - disable debug on production
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      session.user = {
        ...session.user,
        role: token.role,
        id: token.id,
      }
      return session
    },
  },
}
