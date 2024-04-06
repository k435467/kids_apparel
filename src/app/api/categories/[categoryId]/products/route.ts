import clientPromise from '@/utils/database/mongoClient'
import { NextRequest } from 'next/server'
import { ObjectId } from 'mongodb'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/utils/auth'
import { accessChecker } from '@/utils/access'
import { mdb } from '@/utils/database/collections'

export async function GET(req: NextRequest, { params }: { params: { categoryId: string } }) {
  const categoryId = params.categoryId

  try {
    const client = await clientPromise
    const db = client.db('kids-apparel')

    const oId = new ObjectId(categoryId)

    const cursor = db.collection('products').find(
      { categoryId: oId, isOnShelf: true },
      {
        sort: {
          _id: 1,
        },
        limit: 10,
      },
    )

    const products = await cursor.toArray()

    return Response.json(products)
  } catch (err) {
    console.error(err)
    return Response.error()
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { categoryId: string } }) {
  const session = await getServerSession(authOptions)
  if (!accessChecker.hasManagerAccess(session?.user?.role)) {
    return Response.json({ message: accessChecker.message.forbidden }, { status: 403 })
  }

  try {
    const client = await clientPromise
    const coll = client.db(mdb.dbName).collection(mdb.coll.categories)

    const reqBody: {
      isRemove: boolean
      productIds: string[]
    } = await req.json()

    const result = await coll.updateOne(
      { _id: new ObjectId(params.categoryId) },
      reqBody.isRemove
        ? {
            $pull: {
              productIds: {
                $in: reqBody.productIds.map((v) => new ObjectId(v)),
              },
            },
          }
        : {
            $addToSet: {
              productIds: {
                $each: reqBody.productIds.map((v) => new ObjectId(v)),
              },
            },
          },
    )

    return Response.json(result)
  } catch (err) {
    console.error(err)
    return Response.json(err, { status: 500 })
  }
}
