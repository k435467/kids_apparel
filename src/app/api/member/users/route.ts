import { accessChecker } from '@/utils/access'
import { authOptions } from '@/utils/auth'
import clientPromise from '@/utils/database/mongoClient'
import { getServerSession } from 'next-auth'
import { NextRequest } from 'next/server'
import { IDocUser } from '@/types/database'
import { mdb } from '@/utils/database/collections'

export interface IGetMemberUsersCondition {
  page: number
  pageSize: number
}

export interface IGetMemberUsersResponse {
  total: number
  data: IDocUser[]
}

const makeGetUsersConditionAndValidate = (search: URLSearchParams): IGetMemberUsersCondition => {
  const condition = {
    page: parseInt(search.get('page') ?? '1'),
    pageSize: parseInt(search.get('pageSize') ?? '1'),
  }
  if (condition.page < 1 || condition.pageSize > 30) {
    throw new Error('Condition is invalid.')
  }
  return condition
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!accessChecker.hasAdminAccess(session?.user?.role)) {
    return Response.json({ message: accessChecker.message.forbidden }, { status: 403 })
  }
  try {
    const condition = makeGetUsersConditionAndValidate(req.nextUrl.searchParams)

    const coll = (await clientPromise).db(mdb.dbName).collection<IDocUser>(mdb.coll.users)

    const users = await coll
      .find({})
      .project({
        password: 0,
      })
      .sort({ _id: -1 })
      .limit(condition.pageSize)
      .skip(condition.pageSize * (condition.page - 1))
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
