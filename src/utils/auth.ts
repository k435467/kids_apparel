import { AuthOptions, User } from 'next-auth'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import clientPromise from '@/utils/mongodb'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'

const credentialsProviderConfigs = CredentialsProvider({
  // The name to display on the sign in form (e.g. "Sign in with...")
  name: 'Credentials',
  // `credentials` is used to generate a form on the sign in page.
  // You can specify which fields should be submitted, by adding keys to the `credentials` object.
  // e.g. domain, username, password, 2FA token, etc.
  // You can pass any HTML attribute to the <input> tag through the object.
  credentials: {
    phoneNumber: {
      label: '手機號碼',
      type: 'number',
    },
    password: {
      label: '密碼',
      type: 'password',
    },
  },
  async authorize(credentials, req) {
    const client = await clientPromise
    const userColl = client.db('kids-apparel').collection('users')

    // Find user
    const user = (await userColl.findOne({
      phoneNumber: credentials!.phoneNumber.toLowerCase(),
    })) as
      | ({
          _id: string
          password: string
        } & User)
      | null
    if (!user) {
      throw new Error('該手機號碼尚未註冊!')
    }

    // Validate password
    const passwordIsValid = await bcrypt.compare(credentials!.password, user.password)
    if (!passwordIsValid) {
      throw new Error('帳號密碼錯誤!')
    }

    return {
      ...user,
      id: user._id.toString(),
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
        token.id = user.id
        token.role = user.role
        token.phoneNumber = user.phoneNumber
        token.userName = user.userName
      }
      return token
    },
    session({ session, token }) {
      session.user = {
        id: token.id,
        role: token.role,
        phoneNumber: token.phoneNumber,
        userName: token.userName,
      }
      return session
    },
  },
}
