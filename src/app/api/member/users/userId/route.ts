import { accessChecker } from '@/utils/access'
import { authOptions, saltRounds } from '@/utils/auth'
import clientPromise from '@/utils/mongodb'
import { ObjectId } from 'mongodb'
import { getServerSession } from 'next-auth'
import { NextRequest } from 'next/server'
import bcrypt from 'bcrypt'

/**
 * WIP
 */
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!accessChecker.hasManagerAccess(session?.user?.role)) {
    return Response.json({ message: accessChecker.message.forbidden }, { status: 403 })
  }
  try {
    const user = (await req.json()) as {
      _id?: string
      phoneNumber?: string
      password?: string
      userName?: string
    }

    const userObjectId = new ObjectId(user._id)
    delete user._id

    // Encrypt password
    // Set the value back to the user object
    let hash: string = ''
    if (user.password) {
      try {
        hash = await bcrypt.hash(user.password, saltRounds)
        user.password = hash
      } catch (err) {
        console.error(err)
        return Response.json('Data process failed.', { status: 500 })
      }
    }

    const client = await clientPromise
    const coll = client.db('kids-apparel').collection('users')

    const updateResult = coll.updateOne({ _id: userObjectId }, { set: user })

    return Response.json(updateResult)
  } catch (err) {
    return Response.json(err, { status: 500 })
  }
}
