import { AuthOptions } from 'next-auth'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import clientPromise from '@/utils/mongodb'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'

const saltRounds = 5

const credentialsProviderConfigs = CredentialsProvider({
  // The name to display on the sign in form (e.g. "Sign in with...")
  name: 'Credentials',
  // `credentials` is used to generate a form on the sign in page.
  // You can specify which fields should be submitted, by adding keys to the `credentials` object.
  // e.g. domain, username, password, 2FA token, etc.
  // You can pass any HTML attribute to the <input> tag through the object.
  credentials: {
    email: {
      label: 'E-mail',
      type: 'email',
      // characters@characters.domain
      // characters followed by an @ sign, followed by more characters, and then a "."
      // After the "." sign, add at least 2 letters from a to z:
      pattern: '[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$',
      placeholder: 'example@gmail.com',
    },
    password: {
      label: '密碼',
      type: 'password',
      // Must contain 8 or more characters
      pattern: '.{6,}',
      placeholder: '至少6個字元',
    },
  },
  async authorize(credentials, req) {
    const client = await clientPromise
    const userColl = client.db('kids-apparel').collection('users')

    // Find user
    const user = (await userColl.findOne({
      email: credentials!.email.toLowerCase(),
    })) as {
      _id: string
      password: string
    } | null
    if (!user) {
      throw new Error('該Email尚未註冊!')
    }

    // Validate password
    const passwordIsValid = await bcrypt.compare(credentials!.password, user.password)
    if (!passwordIsValid) {
      throw new Error('帳號密碼錯誤!')
    }

    return {
      id: user._id.toString(),
      ...user,
    }
  },
})

// -----

export const authOptions: AuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [credentialsProviderConfigs],
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
