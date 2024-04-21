import { accessChecker } from '@/utils/access'
import { authOptions } from '@/utils/auth'
import clientPromise from '@/utils/database/mongoClient'
import { getServerSession } from 'next-auth'
import { NextRequest } from 'next/server'
import { IDocUser } from '@/types/database'
import { mdb } from '@/utils/database/collections'
import { makePaginationAndValidate } from '@/utils/searchParams'

export interface IGetMemberUsersResponse {
  total: number
  data: IDocUser[]
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!accessChecker.hasAdminAccess(session?.user?.role)) {
    return Response.json({ message: accessChecker.message.forbidden }, { status: 403 })
  }
  try {
    const pagination = makePaginationAndValidate(req.nextUrl.searchParams)

    const coll = (await clientPromise).db(mdb.dbName).collection<IDocUser>(mdb.coll.users)

    const users = await coll
      .find({})
      .project({
        password: 0,
      })
      .sort({ _id: -1 })
      .limit(pagination.pageSize)
      .skip(pagination.pageSize * (pagination.current - 1))
      .toArray()

    const total = await coll.countDocuments({})

    return Response.json({
      total,
      data: users,
    } as IGetMemberUsersResponse)
  } catch (err) {
    console.error(err)
    return Response.error()
  }
}
