import clientPromise from '@/utils/mongodb'
import { authOptions } from '@/utils/auth'
import { NextRequest } from 'next/server'
import { ObjectId } from 'mongodb'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('kids-apparel')

    const categories = await db
      .collection('categories')
      .find({})
      .limit(10)
      .sort({ order: 1 })
      .toArray()

    return Response.json(categories)
  } catch (err) {
    console.error(err)
    return Response.error()
  }
}

export async function POST(req: NextRequest) {
  // const session = await getServerSession(authOptions)
  // if (!session || session.user?.role != 'admin') {
  //   return Response.json({ message: 'Please check the role of the user.' }, { status: 403 })
  // }

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
  // const session = await getServerSession(authOptions)
  // if (!session || session.user?.role != 'admin') {
  //   return Response.json({ message: 'Please check the role of the user.' }, { status: 403 })
  // }

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
