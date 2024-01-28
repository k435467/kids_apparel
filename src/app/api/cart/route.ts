import clientPromise from '@/utils/mongodb'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/utils/auth/authOptions'
import { NextRequest } from 'next/server'
import { ObjectId } from 'mongodb'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return Response.json({ message: 'Please login.' }, { status: 401 })
  }

  try {
    const client = await clientPromise
    const db = client.db('kids-apparel')

    const userObjectId = new ObjectId(session.user._id)

    console.log(`dbg_111 user.id`, userObjectId.id)

    // const insertResult = await db.collection('categories').insertMany(categories)

    return Response.json({})
  } catch (err) {
    return Response.json(err, { status: 500 })
  }
}
