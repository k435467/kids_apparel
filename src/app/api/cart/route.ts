import clientPromise from '@/utils/mongodb'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/utils/auth'
import { NextRequest } from 'next/server'
import { ObjectId } from 'mongodb'

/**
 * WIP
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return Response.json({ message: 'Please login.' }, { status: 401 })
  }

  try {
    const client = await clientPromise
    const db = client.db('kids-apparel')

    const userObjectId = new ObjectId(session.user.id)

    console.log(`dbg_111 user.id`, userObjectId.id)

    // const insertResult = await db.collection('categories').insertMany(categories)

    return Response.json({})
  } catch (err) {
    return Response.json(err, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  if (!userId) {
    return Response.json({ message: 'Please login.' }, { status: 401 })
  }

  try {
    const client = await clientPromise
    const coll = client.db('kids-apparel').collection('carts')

    const items = await coll
      .aggregate([
        {
          $match: {
            userId: new ObjectId(userId),
          },
        },
        {
          $lookup: {
            from: 'products',
            localField: 'items.productId',
            foreignField: '_id',
            as: 'productData',
          },
        },
        {
          $addFields: {
            productData: {
              $map: {
                input: '$productData',
                as: 'data',
                in: {
                  $mergeObjects: ['$$data', { imgName: { $first: '$$data.imgNames' } }],
                },
              },
            },
          },
        },
        {
          $unset: [
            'productData.description',
            'productData.descriptionList',
            'productData.categoryId',
            'productData.isOnShelf',
            'productData.isOnHomePage',
            'productData.imgNames',
          ],
        },
      ])
      .toArray()

    return Response.json(items)
  } catch (err) {
    return Response.json(err, { status: 500 })
  }
}