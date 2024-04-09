import clientPromise from '@/utils/database/mongoClient'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/utils/auth'
import { accessChecker } from '@/utils/access'
import { NextRequest } from 'next/server'
import { ObjectId } from 'mongodb'
import { mdb } from '@/utils/database/collections'
import { IDocCategory } from '@/types/database'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db(mdb.dbName)

    const categories = await db
      .collection<IDocCategory>(mdb.coll.categories)
      .find({})
      .sort({ sort: 1 })
      .limit(10)
      .toArray()

    return Response.json(categories)
  } catch (err) {
    console.error(err)
    return Response.error()
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!accessChecker.hasManagerAccess(session?.user?.role)) {
    return Response.json({ message: accessChecker.message.forbidden }, { status: 403 })
  }

  try {
    const client = await clientPromise
    const coll = client.db(mdb.dbName).collection<IDocCategory>(mdb.coll.categories)

    const category = await req.json()

    const insertResult = await coll.insertOne(category)

    return Response.json(insertResult)
  } catch (err) {
    return Response.json(err, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!accessChecker.hasManagerAccess(session?.user?.role)) {
    return Response.json({ message: accessChecker.message.forbidden }, { status: 403 })
  }

  try {
    const client = await clientPromise
    const coll = client.db(mdb.dbName).collection<IDocCategory>(mdb.coll.categories)

    const categorySorts = (await req.json()) as { _id: string; sort: number }[]

    const bulkWriteResult = await coll.bulkWrite(
      categorySorts.map((v) => ({
        updateOne: {
          filter: { _id: new ObjectId(v._id!) },
          update: {
            $set: {
              sort: v.sort,
            },
          },
        },
      })),
    )

    return Response.json(bulkWriteResult)
  } catch (err) {
    return Response.json(err, { status: 500 })
  }
}
