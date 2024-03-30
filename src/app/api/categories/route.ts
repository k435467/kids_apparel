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
      .sort({ order: 1 })
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
    const db = client.db('kids-apparel')

    const categories = await req.json()

    const insertResult = await db.collection('categories').insertMany(categories)

    return Response.json(insertResult)
  } catch (err) {
    return Response.json(err, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!accessChecker.hasManagerAccess(session?.user?.role)) {
    return Response.json({ message: accessChecker.message.forbidden }, { status: 403 })
  }

  try {
    const categories = (await req.json()) as ICategory[]

    const client = await clientPromise
    const db = client.db('kids-apparel')

    const bulkWriteResult = await db.collection('categories').bulkWrite(
      categories.map((v) => ({
        updateOne: {
          filter: { _id: new ObjectId(v._id!) },
          update: {
            $set: {
              isOnShelf: v.isOnShelf,
              title: v.title,
              order: v.order,
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
