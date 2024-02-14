import { accessChecker } from '@/utils/access'
import { authOptions } from '@/utils/auth'
import clientPromise from '@/utils/mongodb'
import { getServerSession } from 'next-auth'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!accessChecker.hasAdminAccess(session?.user?.role)) {
    return Response.json({ message: accessChecker.message.forbidden }, { status: 403 })
  }
  try {
    const searchParams = req.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') ?? '1')
    if (page < 1) {
      throw new Error('Page is invalid.')
    }

    const client = await clientPromise
    const coll = client.db('kids-apparel').collection('users')

    const users = await coll
      .find({}, { sort: { _id: -1 }, limit: 10, skip: 10 * (page - 1) })
      .project({
        password: 0,
      })
      .toArray()

    return Response.json(users)
  } catch (err) {
    console.error(err)
    return Response.error()
  }
}
