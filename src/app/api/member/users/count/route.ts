import { accessChecker } from '@/utils/access'
import { authOptions } from '@/utils/auth'
import clientPromise from '@/utils/database/mongoClient'
import { getServerSession } from 'next-auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!accessChecker.hasAdminAccess(session?.user?.role)) {
    return Response.json({ message: accessChecker.message.forbidden }, { status: 403 })
  }
  try {
    const client = await clientPromise
    const coll = client.db('kids-apparel').collection('users')

    const count = await coll.countDocuments({})

    return Response.json(count)
  } catch (err) {
    console.error(err)
    return Response.error()
  }
}
